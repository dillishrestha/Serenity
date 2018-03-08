namespace Serenity.UI {

    export interface CategoryProps {
        categoryId?: string;
        category?: string;
        idPrefix?: string;
        localTextPrefix?: string;
        items?: Serenity.PropertyItem[];
    }

    export class Category extends React.Component<CategoryProps> {

        renderBreak(formClass: string) {
            var breakClass = "line-break";

            var splitted = formClass.split(' ');
            if (splitted.indexOf('line-break-xs') >= 0) {
            }
            else if (splitted.indexOf('line-break-sm') >= 0) {
                breakClass += " hidden-xs";
            }
            else if (splitted.indexOf('line-break-md') >= 0) {
                breakClass += " hidden-sm";
            }
            else if (splitted.indexOf('line-break-lg') >= 0) {
                breakClass += " hidden-md";
            }

            return (<div className={breakClass} style={{ width: "100%" }}></div>)
        }

        render() {
            var props = this.props;
            return (
                <div className="category">
                    {props.items && props.items.map(x => {
                        if (x.formCssClass && x.formCssClass.indexOf('line-break-') >= 0) {
                            return (
                                <React.Fragment key={x.name}>
                                    {this.renderBreak(x.formCssClass)}
                                    <PropertyField {...x} />>
                                </React.Fragment>
                            )
                        }

                        return (<PropertyField idPrefix={props.idPrefix} localTextPrefix={props.localTextPrefix} {...x} key={x.name} />);
                    })}
                    {props.children}
                </div>
            );
        }
    }
}