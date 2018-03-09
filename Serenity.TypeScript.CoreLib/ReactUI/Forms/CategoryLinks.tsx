namespace Serenity.UI {

    export interface CategoryLinksProps {
        idPrefix?: string;
        items?: Serenity.PropertyItem[];
        defaultCategory?: string;
        categoryOrder?: string;
        localTextPrefix?: string;
    }

    export class CategoryLinks extends React.Component<CategoryLinksProps> {

        protected text = Q.prefixedText(this.props.localTextPrefix);

        render() {
            var groups = Categories.groupByCategory(this.props.items);

            return (
                <div className="category-links">
                    {groups.inOrder.map((g, idx) => [
                        <CategoryLink categoryId={"Category" + g.order}>
                            {this.text(g.key, "Categories." + g.key)}
                        </CategoryLink>
                    ])}
                </div>
            )
        }
    }
}