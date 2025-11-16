import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "LOGIN",
        "LOGOUT",
        "SIGNUP",
        "ERROR",
        "ACCESS",
      ],
    },
    entity: {
      type: String,
      required: true,
      enum: [
        "User",
        "Movie",
        "Review",
        "Watchlist",
        "Genre",
        "Actor",
        "Director",
        "Auth",
        "System",
      ],
    },
    entityId: {
      type: String,
      required: false,
    },
    userId: {
      type: Number,
      required: false,
    },
    userEmail: {
      type: String,
      required: false,
    },
    method: {
      type: String,
      enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    },
    endpoint: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    statusCode: {
      type: Number,
    },
    message: {
      type: String,
    },
    error: {
      type: mongoose.Schema.Types.Mixed,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances de recherche
logSchema.index({ createdAt: -1 });
logSchema.index({ userId: 1 });
logSchema.index({ entity: 1, entityId: 1 });
logSchema.index({ action: 1 });

export const Log = mongoose.model("Log", logSchema);

