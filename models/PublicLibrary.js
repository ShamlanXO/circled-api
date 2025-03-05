const mongoose = require("mongoose");

const PublicLibrarySchema = new mongoose.Schema({
    triggerMuscle: [{ type: String }],
    title: { type: String, default: null },
    description: { type: String, default: null },
    href: { type: String, default: null },
    provider : { type: String, default: "local" },
    },
    { timestamps: true});

    module.exports = mongoose.model("publicvideos", PublicLibrarySchema);

