namespace Serenity.UI {

    export class NamedRefs {

        private refs: Q.Dictionary<any> = {};

        constructor() {
            this.setRef = this.setRef.bind(this);
        }

        getRef(name: string) {
            return this.refs[name];
        }

        setRef(name: string, ref: any) {
            this.refs[name] = ref;
        }
    }
}