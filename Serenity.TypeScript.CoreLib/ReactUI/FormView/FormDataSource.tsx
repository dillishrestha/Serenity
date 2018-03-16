namespace Serenity.UI {   

    export interface FormDataSourceProps<TEntity> {
        service?: string;
        retrieveUrl?: string;
        entityId?: any;
        entity?: TEntity;
        idProperty: string;
        isActiveProperty?: string;
        isDeletedProperty?: string;
        readOnly?: boolean;
        view?: (model: FormDataModel<TEntity>) => React.ReactNode;
    }

    export interface FormDataSourceState<TEntity> {
        entity: TEntity;
        formMode: FormMode;
    }

    export class FormDataSource<TEntity> extends React.Component<FormDataSourceProps<TEntity>, FormDataSourceState<TEntity>> {

        private emptyEntity: TEntity = Object.create(null);
        private pendingEntity: TEntity;
        private canSetState: boolean;

        constructor(props: FormDataSourceProps<TEntity>, context?: any) {
            super(props, context);

            var entity = this.props.entity;

            this.state = {
                formMode: this.modeFor(entity),
                entity: entity
            };

            if (this.props.entityId != null)
                this.loadById(this.props.entityId);

            this.delete = this.delete.bind(this);
        }

        componentWillReceiveProps(nextProps: FormDataSourceProps<TEntity>) {
            if (nextProps.entityId !== this.props.entityId) {
                if (nextProps.entityId == null) {
                    this.loadEntity(nextProps.entity || Object.create(null));
                }
                else {
                    this.loadById(nextProps.entityId);
                }
            }
            else if (nextProps.entity != this.props.entity) {
                this.loadEntity(nextProps.entity || Object.create(null));
            }
        }

        componentDidMount() {
            this.canSetState = true;
            if (this.pendingEntity !== undefined) {
                this.loadEntity(this.pendingEntity || Object.create(null));
            }
        }

        componentWillUnmount() {
            this.canSetState = false;
        }

        loadEntity(entity: TEntity) {
            if (this.canSetState) {
                this.setState({
                    formMode: this.modeFor(entity),
                    entity: entity
                });
                this.pendingEntity = undefined;
            }
            else {
                this.pendingEntity = entity || null;
            }
        }

        loadResponse(response: RetrieveResponse<TEntity>) {
            this.loadEntity(response.Entity);
        }

        getLoadByIdRequest(entityId: any): RetrieveRequest {
            return {
                EntityId: entityId
            }
        }

        getLoadByIdOptions(entityId: any): ServiceOptions<RetrieveResponse<TEntity>> {
            return {
                service: this.props.retrieveUrl ? null : (this.props.service || "ServiceNotSet!") + "/Retrieve"),
                url: this.props.retrieveUrl,
                request: this.getLoadByIdRequest(entityId)
            }
        }

        loadById(entityId: any): PromiseLike<RetrieveResponse<TEntity>> {
            var options = this.getLoadByIdOptions(entityId);
            return Q.serviceCall(options).then(response => {
                this.loadResponse(response);
                return response;
            });
        }

        isDeleted(entity: TEntity): boolean {
            if (this.props.isDeletedProperty && entity[this.props.isDeletedProperty])
                return true;

            if (this.props.isActiveProperty && entity[this.props.isActiveProperty] === -1)
                return true;
        }

        modeFor(entity: TEntity) {
            if (entity == null)
                return FormMode.Initial;

            if (this.props.readOnly)
                return FormMode.View;

            if (this.props.idProperty && entity[this.props.idProperty] != null)
                return FormMode.Edit;

            if (this.isDeleted(entity))
                return FormMode.Deleted;
        }

        save(entity: TEntity, newValues: Partial<TEntity>): PromiseLike<void> {
            return null;
        }

        delete(entity: TEntity): PromiseLike<void> {
            return null;
        }

        undelete(): PromiseLike<void> {
            return null;
        }

        dataModel(): FormDataModel<TEntity> {
            return {
                entity: this.state.entity || this.emptyEntity,
                formMode: this.state.formMode,
                onSave: (this.state.formMode == FormMode.Edit || this.state.mode == FormMode.New) ? this.save : null,
                onDelete: this.state.formMode == FormMode.Edit ? this.delete : null,
                onUndelete: this.state.formMode == FormMode.Deleted ? this.undelete : null
            };
        }

        get entity() {
            return this.pendingEntity !== undefined ? this.pendingEntity : this.props.entity;
        }

        render() {
            return this.props.view(this.dataModel());
        }
    }
}