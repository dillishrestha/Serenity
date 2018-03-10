namespace Serenity {

    @Decorators.registerClass('PropertyGrid')
    export class PropertyGrid extends Widget<PropertyGridOptions> {

        private editors: Widget<any>[];
        private items: PropertyItem[];

        constructor(div: JQuery, opt: PropertyGridOptions) {
            super(div, opt);

            if (opt.mode == null)
                opt.mode = 1;

            div.addClass('s-PropertyGrid');
            this.editors = [];
            this.items = this.options.items || [];

            if (div.length > 0)
                ReactDOM.render(React.createElement(UI.IntraPropertyGrid, this.options), div[0]);

            this.element.find(".field").each((i, el) => {
                if ($(el).closest('.s-PropertyGrid')[0] !== this.element[0])
                    return;

                var w: Widget<any>;
                var wrapper = $(el).find('.widget-wrapper');

                if (wrapper.length == 1) {
                    var ed = wrapper.children();

                    if (ed.length > 1) {
                        var withEdClass = ed.filter('.editor').not('.select2-container')
                        if (withEdClass.length == 1)
                            ed = withEdClass;
                        else {
                            var withName = ed.filter((i, e) => !!$(e).attr('name'));
                            if (withName.length == 1)
                                ed = withName;
                        }
                    }

                    if (ed.length == 1) {
                        w = ed.tryGetWidget(Serenity.Widget);
                        if (w != null) {
                            this.editors.push(w);
                            return;
                        }
                    }
                }

                var eds = $(el).find('.editor').not('.select2-container');
                if (eds.length > 1) {
                    eds = eds.filter((i, e) => !!$(e).attr('name'));
                }

                if (eds.length == 1) {
                    w = eds.tryGetWidget(Serenity.Widget);
                    if (w != null) {
                        this.editors.push(w);
                        return;
                    }
                }

                eds = $(el).find(':input');
                if (eds.length == 1) {
                    w = eds.tryGetWidget(Serenity.Widget);
                    if (w != null) {
                        this.editors.push(w);
                        return;
                    }
                }
            });

            this.updateInterface();
        }

        destroy() {
            if (this.editors != null) {
                for (var i = 0; i < this.editors.length; i++) {
                    this.editors[i] != null && this.editors[i].destroy();
                }
                this.editors = null;
            }

            Serenity.Widget.prototype.destroy.call(this);
        }

        get_editors(): Widget<any>[] {
            return this.editors;
        }

        get_items(): PropertyItem[] {
            return this.items;
        }

        get_idPrefix(): string {
            return this.options.idPrefix;
        }

        get_mode(): PropertyGridMode {
            return this.options.mode;
        }

        set_mode(value: PropertyGridMode) {
            if(this.options.mode !== value) {
                this.options.mode = value;
                this.updateInterface();
            }
        }

        // Obsolete
        static loadEditorValue(editor: Serenity.Widget<any>,
            item: PropertyItem, source: any): void {
        }

        // Obsolete
        static saveEditorValue(editor: Serenity.Widget<any>,
            item: PropertyItem, target: any): void {

            EditorUtils.saveValue(editor, item, target);
        }

        // Obsolete
        private static setReadOnly(widget: Serenity.Widget<any>, isReadOnly: boolean): void {
            EditorUtils.setReadOnly(widget, isReadOnly);
        }

        // Obsolete
        private static setReadonly(elements: JQuery, isReadOnly: boolean): JQuery {
            return EditorUtils.setReadonly(elements, isReadOnly);
        }

        // Obsolete
        private static setRequired(widget: Serenity.Widget<any>, isRequired: boolean): void {
            EditorUtils.setRequired(widget, isRequired);
        }

        load(source: any): void {
            for (var i = 0; i < this.editors.length; i++) {
                var item = this.items[i];
                var editor = this.editors[i];
                if (editor == null)
                    continue;
                if (!!(this.get_mode() === 1 && item.defaultValue != null) &&
                    typeof (source[item.name]) === 'undefined') {
                    source[item.name] = item.defaultValue;
                }

                Serenity.EditorUtils.loadValue(editor, item, source);
            }
        }

        save(target: any): void {
            for (var i = 0; i < this.editors.length; i++) {
                var item = this.items[i];
                if (item.oneWay !== true && this.canModifyItem(item)) {
                    var editor = this.editors[i];
                    Serenity.EditorUtils.saveValue(editor, item, target);
                }
            }
        }

        private canModifyItem(item: PropertyItem) {
            if (this.get_mode() === PropertyGridMode.insert) {
                if (item.insertable === false) {
                    return false;
                }

                if (item.insertPermission == null) {
                    return true;
                }

                return Q.Authorization.hasPermission(item.insertPermission);
            }
            else if (this.get_mode() === PropertyGridMode.update) {
                if (item.updatable === false) {
                    return false;
                }

                if (item.updatePermission == null) {
                    return true;
                }

                return Q.Authorization.hasPermission(item.updatePermission);
            }
			return true;
        }

        updateInterface() {
            for (var i = 0; i < this.editors.length; i++) {
                var item = this.items[i];
                var editor = this.editors[i];
                var readOnly = item.readOnly === true || !this.canModifyItem(item);
                Serenity.EditorUtils.setReadOnly(editor, readOnly);
                Serenity.EditorUtils.setRequired(editor, !readOnly &&
                    !!item.required && item.editorType !== 'Boolean');
                if (item.visible === false || item.readPermission != null ||
                    item.insertPermission != null || item.updatePermission != null ||
                    item.hideOnInsert === true || item.hideOnUpdate === true) {
                    var hidden = (item.readPermission != null &&
                        !Q.Authorization.hasPermission(item.readPermission)) ||
                        item.visible === false ||
                        (this.get_mode() === PropertyGridMode.insert && item.hideOnInsert === true) ||
                        (this.get_mode() === 2 && item.hideOnUpdate === true);

                    editor.getGridField().toggle(!hidden);
                }
            }
        }

        enumerateItems(callback: (p1: PropertyItem, p2: Serenity.Widget<any>) => void): void {
            for (var i = 0; i < this.editors.length; i++) {
                var item = this.items[i];
                var editor = this.editors[i];
                callback(item, editor);
            }
        }
    }

    export declare const enum PropertyGridMode {
        insert = 1,
        update = 2
    }


}