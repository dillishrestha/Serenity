namespace Serenity.UI {    
    export interface FormDataModel<TEntity> {
        entity: TEntity;
        formMode: FormMode;
        onSave?: (values: TEntity) => PromiseLike<void>;
        onDelete?: () => PromiseLike<void>;
        onUndelete?: () => PromiseLike<void>;
        onReload?: () => PromiseLike<void>;
    }
}