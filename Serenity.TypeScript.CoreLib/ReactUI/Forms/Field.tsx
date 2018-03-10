namespace Serenity.UI {
    export type EditorRenderProps = {
        name?: string;
        id?: string;
        required?: boolean;
    }

    export interface FieldProps {
        name?: string;
        id?: string;
        className?: string;
        caption?: string | false;
        labelWidth?: number | string;
        label?: ((p: LabelProps) => JSX.Element);
        htmlFor?: string;
        editor?: ((p: EditorRenderProps) => JSX.Element);
        hint?: string;
        required?: boolean;
        vx?: boolean;
    }

    export interface EditorProps {
        className?: string;
        name?: string;
        id?: string;
        editor?: ((p: EditorRenderProps) => JSX.Element);
        required?: boolean;
    }

    export class Field extends React.Component<FieldProps> {

        render() {
            var props = this.props;

            var lblElement: JSX.Element;
            if (props.label != null)
                lblElement = props.label(this.props);
            else if (props.caption !== false) {
                lblElement = (
                    <Label
                        htmlFor={props.htmlFor === undefined ? props.id : props.htmlFor}
                        hint={props.hint}
                        width={props.labelWidth}
                        required={props.required}>
                        {props.caption}
                    </Label>
                );
            }

            var className = "field";
            if (props.name) {
                className += " " + props.name;
            }

            if (props.className) {
                className += " " + props.className;
            }

            var editorProps: EditorProps = {
                className: "editor",
                name: this.props.name,
                id: this.props.id,
                required: this.props.required
            }

            return (
                <div className={className}>
                    {lblElement}
                    {props.editor != null && props.editor(editorProps)}
                    {props.children}
                    {props.vx !== false && <ValidationMark />}
                    <div className="clear"></div>
                </div>
            );
        }
    }
}