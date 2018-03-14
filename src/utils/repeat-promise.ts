export class RepeatPromise<T> implements Promise<T> {
    readonly [Symbol.toStringTag]: "Promise";
    protected readonly wrappedExecutor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;
    protected readonly promise: Promise<T>;
    protected wrappedResolve!: (value?: T | PromiseLike<T>) => void;
    protected wrappedReject!: (reason?: any) => void;
    protected callCounter = 0;

    constructor(protected executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void, protected tryCount: number = 1) {
        this.wrappedExecutor = (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => {
            this.executor(this.wrappedResolve, this.wrappedReject);
        };
        this.promise = new Promise<T>((resolve, reject) => {
            this.wrappedResolve = value => resolve(value);
            this.wrappedReject = reason => {
                this.callCounter++;
                if (this.callCounter > this.tryCount)
                    reject(reason);
                setTimeout(() => this.wrappedExecutor(resolve, reject), 0);
            };
            this.executor(this.wrappedResolve, this.wrappedReject);
        });
    }

    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2> {
        return this.promise.then(onfulfilled, onrejected);
    }

    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<T | TResult> {
        return this.promise.catch(onrejected);
    }
}