import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-student-companion';
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Simple in-memory storage fallback
const inMemoryStorage = {
  messages: [],
  users: [],
  sessions: [],
  // Add TTL index for auto-cleanup of old messages (24 hours)
  _lastCleanup: Date.now(),
  cleanup() {
    const now = Date.now();
    // Cleanup every 6 hours
    if (now - this._lastCleanup > 6 * 60 * 60 * 1000) {
      const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
      this.messages = this.messages.filter(msg => new Date(msg.timestamp) > oneDayAgo);
      this.sessions = this.sessions.filter(session => new Date(session.expiresAt) > now);
      this._lastCleanup = now;
    }
  },
  // Add message with auto-cleanup
  addMessage(msg) {
    const newMsg = { ...msg, timestamp: new Date() };
    this.messages.push(newMsg);
    this.cleanup();
    return newMsg;
  },
  // Add session with auto-cleanup
  addSession(session) {
    const newSession = { ...session, createdAt: new Date() };
    this.sessions.push(newSession);
    this.cleanup();
    return newSession;
  }
};

// Connection options
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5 seconds timeout
  socketTimeoutMS: 45000, // 45 seconds
  maxPoolSize: 10, // Maximum number of connections in the connection pool
  retryWrites: true,
  w: 'majority'
};

// Cache the connection to avoid multiple connections
let cachedConnection = null;

// Initialize Mongoose models
function initializeModels() {
  // Message Schema
  const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    sender: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    metadata: { type: Object, default: {} }
  });
  
  // User Schema
  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
    preferences: { type: Object, default: {} }
  });
  
  // Session Schema
  const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    userAgent: { type: String },
    ipAddress: { type: String }
  }, { timestamps: true });
  
  // Create indexes
  messageSchema.index({ timestamp: -1 });
  userSchema.index({ username: 1 }, { unique: true });
  userSchema.index({ email: 1 }, { unique: true });
  sessionSchema.index({ token: 1 }, { unique: true });
  sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
  
  // Create models if they don't exist
  if (!mongoose.models.Message) {
    mongoose.model('Message', messageSchema);
  }
  if (!mongoose.models.User) {
    mongoose.model('User', userSchema);
  }
  if (!mongoose.models.Session) {
    mongoose.model('Session', sessionSchema);
  }
}

// Function to connect to MongoDB with retry logic
async function connectWithRetry(retries = MAX_RETRIES) {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    console.log('Connecting to MongoDB...');
    
    // Set mongoose options
    mongoose.set('strictQuery', true);
    
    // Connect to MongoDB
    const connection = await mongoose.connect(DB_URI, connectionOptions);
    
    console.log('MongoDB connected successfully');
    
    // Cache the connection
    cachedConnection = connection;
    
    // Set up event listeners
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      // Reset the cached connection on error
      cachedConnection = null;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      cachedConnection = null;
    });
    
    // Initialize models
    initializeModels();
    
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    
    if (retries > 0) {
      console.log(`Retrying connection (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(retries - 1);
    }
    
    console.error('Failed to connect to MongoDB after retries, falling back to in-memory storage');
    return null;
  }
}

// Database interface
const db = {
  // Initialize database connection
  async connect() {
    try {
      await connectWithRetry();
      return this.isConnected();
    } catch (error) {
      console.error('Database connection failed, using in-memory storage:', error.message);
      return false;
    }
  },
  
  // Check connection status
  isConnected() {
    return mongoose.connection.readyState === 1;
  },
  
  // Get the active connection
  get connection() {
    return this.isConnected() ? mongoose.connection : null;
  },
  
  // Get the appropriate storage (MongoDB or in-memory)
  get storage() {
    return this.isConnected() ? mongoose.connection : inMemoryStorage;
  },
  
  // Message operations
  messages: {
    async create(message) {
      if (mongoose.connection.readyState === 1) {
        const Message = mongoose.model('Message');
        return await Message.create(message);
      } else {
        return inMemoryStorage.addMessage(message);
      }
    },
    
    async find(query = {}) {
      if (mongoose.connection.readyState === 1) {
        const Message = mongoose.model('Message');
        return await Message.find(query).sort({ timestamp: -1 }).limit(100).lean();
      } else {
        return inMemoryStorage.messages
          .filter(msg => {
            return Object.entries(query).every(([key, value]) => {
              return msg[key] === value;
            });
          })
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 100);
      }
    }
  },
  
  // User operations
  users: {
    async create(user) {
      if (mongoose.connection.readyState === 1) {
        const User = mongoose.model('User');
        return await User.create(user);
      } else {
        const newUser = { ...user, _id: Date.now().toString(), createdAt: new Date() };
        inMemoryStorage.users.push(newUser);
        return newUser;
      }
    },
    
    async findOne(query) {
      if (mongoose.connection.readyState === 1) {
        const User = mongoose.model('User');
        return await User.findOne(query).lean();
      } else {
        return inMemoryStorage.users.find(user => 
          Object.entries(query).every(([key, value]) => user[key] === value)
        ) || null;
      }
    },
    
    async updateOne(query, update) {
      if (mongoose.connection.readyState === 1) {
        const User = mongoose.model('User');
        return await User.updateOne(query, update);
      } else {
        const index = inMemoryStorage.users.findIndex(user => 
          Object.entries(query).every(([key, value]) => user[key] === value)
        );
        if (index !== -1) {
          inMemoryStorage.users[index] = { ...inMemoryStorage.users[index], ...update };
          return { modifiedCount: 1 };
        }
        return { modifiedCount: 0 };
      }
    }
  },
  
  // Session operations
  sessions: {
    async create(session) {
      if (mongoose.connection.readyState === 1) {
        const Session = mongoose.model('Session');
        return await Session.create(session);
      } else {
        return inMemoryStorage.addSession(session);
      }
    },
    
    async findOne(query) {
      if (mongoose.connection.readyState === 1) {
        const Session = mongoose.model('Session');
        return await Session.findOne(query).lean();
      } else {
        return inMemoryStorage.sessions.find(session => 
          Object.entries(query).every(([key, value]) => session[key] === value)
        ) || null;
      }
    },
    
    async deleteOne(query) {
      if (mongoose.connection.readyState === 1) {
        const Session = mongoose.model('Session');
        await Session.deleteOne(query);
        return { deletedCount: 1 };
      } else {
        const initialLength = inMemoryStorage.sessions.length;
        inMemoryStorage.sessions = inMemoryStorage.sessions.filter(session => 
          !Object.entries(query).every(([key, value]) => session[key] === value)
        );
        return { deletedCount: initialLength - inMemoryStorage.sessions.length };
      }
    }
  }
};

// Initialize models if we're already connected (e.g., in development)
if (mongoose.connection.readyState === 1) {
  initializeModels();
}

// Export the database interface
export default db;
export { inMemoryStorage };
