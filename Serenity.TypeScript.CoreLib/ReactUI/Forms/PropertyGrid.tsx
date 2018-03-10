namespace Serenity {
    export interface PropertyGridOptions {
        idPrefix?: string;
        items?: PropertyItem[];
        useCategories?: boolean;
        categoryOrder?: string;
        defaultCategory?: string;
        localTextPrefix?: string;
        mode?: PropertyGridMode;
        renderCategories?: (tab: string, props: UI.CategoriesProps) => React.ReactNode;
        renderCategory?: (props: UI.CategoryProps) => React.ReactNode;
        renderField?: (props: PropertyItem) => React.ReactNode;
    }
}

namespace Serenity.UI {

    export class IntraPropertyGrid extends React.Component<PropertyGridOptions> {

        render(): React.ReactNode {
            var useTabs = Q.any(this.props.items || [], function (x) {
                return !Q.isEmptyOrNull(x.tab);
            });

            if (useTabs)
                return React.createElement(UI.PropertyTabs, this.props);

            var useCategories = this.props.useCategories !== false && Q.any(this.props.items, function (x) {
                return !Q.isEmptyOrNull(x.category);
            });

            if (useCategories) {
                <React.Fragment>
                    {React.createElement(UI.CategoryLinks, this.props)}
                    {React.createElement(UI.Categories, this.props)}
                </React.Fragment>
            }

            return (
                <div className="categories">
                    {React.createElement(UI.Category, this.props)}
                </div>
            )
        }
    }

    export class PropertyGrid extends IntraPropertyGrid {

        render() {
            return (
                <div className="s-PropertyGrid">
                    {super.render()}
                </div>
            );
        }
    }
}