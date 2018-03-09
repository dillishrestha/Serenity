namespace Serenity.UI {

    export interface CategoryProps {
        categoryId?: string;
        category?: string;
        collapsed?: boolean;
        idPrefix?: string;
        localTextPrefix?: string;
        items?: Serenity.PropertyItem[];
    }

    export class Category extends React.Component<CategoryProps, Partial<CategoryProps>> {

        constructor(props: CategoryProps, context?: any) {
            super(props, context);

            this.state = {
                collapsed: this.props.collapsed
            };
        }

        componentWillReceiveProps(nextProps: CategoryProps) {
            if (nextProps.collapsed !== this.props.collapsed) {
                this.setState({
                    collapsed: nextProps.collapsed
                });
            }
        }

        getClassName() {
            if (this.state.collapsed == null)
                return "category ";

            if (this.state.collapsed == true)
                return "category collapsible collapsed";

            return "category collapsible";
        }

        getCategoryId() {
            if (!this.props.categoryId)
                return null;

            return Q.coalesce(this.props.idPrefix, '') + this.props.categoryId;
        }

        handleTitleClick() {
            if (this.state.collapsed == null)
                return;

            this.setState({
                collapsed: !this.state.collapsed
            });
        }

        renderTitle() {
            if (this.props.category == null)
                return null;

            return (
                <CategoryTitle categoryId={this.getCategoryId()}
                    collapsed={this.state.collapsed}
                    onClick={() => this.handleTitleClick()} />
            );
        }

        renderItem(item: PropertyItem) {
            return (
                <PropertyField
                    idPrefix={this.props.idPrefix}
                    localTextPrefix={this.props.localTextPrefix}
                    {...item}
                    key={item.name} />
            );
        }

        renderItemWithBreak(item: PropertyItem) {
            return [<CategoryLineBreak breakClass={item.formCssClass} key={"break-" + item.name} />, this.renderItem(item)];
        }

        render() {
            var props = this.props;
            return (
                <div className={this.getClassName()} >
                    {this.renderTitle()}
                    {props.items && props.items.map(item => {
                        if (item.formCssClass && item.formCssClass.indexOf('line-break-') >= 0)
                            return this.renderItemWithBreak(item);

                        return this.renderItem(item);
                    })}
                    {props.children}
                </div>
            );
        }
    }
}