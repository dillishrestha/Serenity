namespace Serenity {
    export interface CreateWidgetParams<TWidget extends Widget<TOptions>, TOptions> {
        type?: AnyWidgetClass;
        options?: TOptions;
        container?: JQuery;
        element?: (e: JQuery) => void;
        init?: (w: TWidget) => void;
    }
}