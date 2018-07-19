const pool = require("generic-pool").Pool

function createPool(size) {
    return {
        max: size || 5,
        pools: {},
        acquire: (id, options, callback) => {
            if (!this.pools[id]) {
                let that = this
                this.pools[id] = pool({
                    name: id,
                    create: options.create,
                    destroy: options.destroy,
                    max: that.max,
                    idleTimeoutMillis: options.idleTimeoutMillis || 5000,
                    log: false
                    //reapIntervalMillis
                    //priorityRange
                })
            }
            this.pools[id].acquire(callback, options.priority);
        },
        release: (id, obj) => {
            if (this.pools[id]) this.pools[id].release(obj);
        }
    }
}

module.exports = {
    createPool
}