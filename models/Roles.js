/**
 * Add an action to this role
 */
roleSchema.methods.addAction = async function(actionId) {
    // Check if action already exists in this role
    if (!this.actions.includes(actionId)) {
        this.actions.push(actionId);
        await this.save();
    }
    return this;
};

/**
 * INSTANCE METHOD
 * Remove an action from this role
 */
roleSchema.methods.removeAction = async function(actionId) {
    this.actions = this.actions.filter(
        action => action.toString() !== actionId.toString()
    );
    await this.save();
    return this;
};

module.exports = mongoose.model('Role', roleSchema);