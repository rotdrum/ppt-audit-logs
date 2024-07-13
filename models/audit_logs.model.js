const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const AuditLogSchema = new mongoose.Schema({
    uid: { type: String, required: true, default: uuidv4 },
    username: { type: String, default: null },
    endpoint: { type: String, required: true },
    method: { type: String, required: true },
    date: { type: Date, required: true },
    remark: { type: mongoose.Schema.Types.Mixed, default: null },
    request: { type: mongoose.Schema.Types.Mixed, default: null },
    status: { type: String, required: true }
}, {
    strict: true
});

AuditLogSchema.pre("save", async function (next) {
    if (!this.isModified("uid")) {
        this.uid = uuidv4();
    }
    next();
});

module.exports = mongoose.model("AuditLog", AuditLogSchema, "audit_logs");