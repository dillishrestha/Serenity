namespace Serenity.UI {

    export interface CategoryLinkProps {
        categoryId?: string;
        onClick?: React.EventHandler<any>
    }

    export class CategoryLink extends React.Component<CategoryLinkProps> {

        render() {
            return (
                <a className="category-link" tabIndex={-1} onClick={this.props.onClick}
                    href={this.props.categoryId == null ? null : ('#' + this.props.categoryId)}>
                    {this.props.children}
                </a>
            )
        }
    }
}