namespace Serenity.UI {    
    export interface FormDataModel<TEntity> {
        entity: TEntity;
        formMode: FormMode;
        onSave?: (entity: TEntity, newValues: Partial<TEntity>) => PromiseLike<void>;
        onDelete?: (entity: TEntity) => PromiseLike<void>;
        onUndelete?: (entity: TEntity) => PromiseLike<void>;
    }
}