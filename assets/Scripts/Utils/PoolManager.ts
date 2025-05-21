type PoolEntry = {
    prefab: cc.Prefab;
    pool: cc.NodePool;
    compClass?: new () => cc.Component; // optional
};

export default class PoolManager {
    private static _instance: PoolManager;
    public static get instance(): PoolManager {
        if (!this._instance) this._instance = new PoolManager();
        return this._instance;
    }

    private pools: Map<string, PoolEntry> = new Map();

    /**
     * Register a prefab with optional component class (for typed get)
     */
    register<T extends cc.Component>(
        key: string,
        prefab: cc.Prefab,
        compClass?: new () => T,
        preloadCount: number = 0
    ) {
        if (this.pools.has(key)) return;

        const pool = new cc.NodePool();
        for (let i = 0; i < preloadCount; i++) {
            const node = cc.instantiate(prefab);
            pool.put(node);
        }

        this.pools.set(key, { prefab, pool, compClass });
    }

    /**
     * Get a pooled object.
     * If compClass is registered, returns the component. Otherwise returns the node.
     */
    get<T extends cc.Component = cc.Component>(key: string, parent?: cc.Node): T | cc.Node | null {
        const entry = this.pools.get(key);
        if (!entry) {
            cc.warn(`[PoolManager] No pool found for key: ${key}`);
            return null;
        }

        const node = entry.pool.size() > 0 ? entry.pool.get() : cc.instantiate(entry.prefab);
        if (parent) parent.addChild(node);
        node.active = true;

        if (entry.compClass) {
            const comp = node.getComponent<T>(entry.compClass);
            if (!comp) cc.warn(`[PoolManager] Component not found on node.`);
            return comp || null;
        } else {
            return node;
        }
    }

    put<T extends cc.Component = cc.Component>(key: string, obj: T | cc.Node) {
        const entry = this.pools.get(key);
        if (!entry) {
            cc.warn(`[PoolManager] No pool found for key: ${key}`);
            (obj instanceof cc.Node ? obj : obj.node).destroy();
            return;
        }

        const node = obj instanceof cc.Node ? obj : obj.node;
        node.active = false;
        entry.pool.put(node);
    }

    clear(key: string) {
        const entry = this.pools.get(key);
        if (entry) entry.pool.clear();
        this.pools.delete(key);
    }

    clearAll() {
        this.pools.forEach(entry => entry.pool.clear());
        this.pools.clear();
    }
}
