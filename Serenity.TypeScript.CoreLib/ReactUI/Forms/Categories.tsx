namespace Serenity.UI {

    export class CategoriesProps {
        idPrefix?: string;
        items?: Serenity.PropertyItem[];
        defaultCategory?: string;
        categoryOrder?: string;
        localTextPrefix?: string;
    }

    export class Categories extends React.Component<CategoriesProps> {

        static applyOrder(groups: Q.Groups<Serenity.PropertyItem>, categoryOrder: string): void {
            if (!categoryOrder)
                return;

            var split = categoryOrder.split(';');
            var order = 0;
            var catOrder = {};

            for (var s of split) {
                var x = Q.trimToNull(s);
                if (x == null || catOrder[x] != null)
                    continue;
                catOrder[x] = order++;
            }

            groups.inOrder.sort((g1, g2) => {
                var order1 = catOrder[g1.key];
                if (order1 == null)
                    catOrder[g1.key] = catOrder = order++;

                var order2 = catOrder[g2.key];
                if (order2 == null)
                    catOrder[g2.key] = catOrder = order++;

                return order1 - order2;
            });

            for (order = 0; order < groups.inOrder.length; order++)
                groups.inOrder[order].order = order;
        }

        static groupItems(items: PropertyItem[], defaultCategory?: string, categoryOrder?: string): Q.Groups<PropertyItem> {
            var defCat = Q.coalesce(defaultCategory, '');
            var groups = Q.groupBy(items || [], x => Q.coalesce(x.category, defCat));
            Categories.applyOrder(groups, categoryOrder);
            return groups;
        }

        render() {
            return (
                <div className="categories">
                    {Categories.groupItems(this.props.items || [], this.props.defaultCategory, this.props.categoryOrder).inOrder.map(g => {
                        <Category categoryId={"Category" + g.order} category={g.key}
                            idPrefix={this.props.idPrefix}
                            localTextPrefix={this.props.localTextPrefix}
                            items={g.items} />
                    })}
                </div>
            )
        }
    }
}