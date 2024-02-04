// Location UX
Ext.Loader.setPath('Ext.ux', 'extjs42/includes/ux/');
let request_treestore = Ext.create('PHNet.store.shopping.Requests', {
    storeId: 'requestreestore'
});
Ext.define('PHNet.view.shopping.RequestsGrid', {
    extend: 'Ext.tree.Panel',
    xtype: 'requestsgrid',
    id: 'requestsgrid',
    requires: [
        'Ext.data.*',
        'Ext.grid.*',
        'Ext.tree.*',
        'Ext.util.*',
        'Ext.state.*'
    ],
    store: request_treestore,
    listeners: {
        'afterrender': function(grid, opt) {
            if (!localStorage.getItem('phshopping_userrol')) {
                Ext.getCmp('shopping_request_columndel').hide();
            }
        },
        /*'cellclick': function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
            return false;        
        },*/
        'selectionchange': function(grid, records, eOpts) {
            Ext.getCmp('shopp-btn-upd').setDisabled(!records.length);
            Ext.getCmp('shopp-btn-exp').setDisabled(!records.length);
            if (records[0]) {
                let ubidate = records[0].data.document_date;
                this.fireEvent('requestselect', ubidate);
            } else {
                this.fireEvent('unselect');
            }
        }
    },
    viewConfig: {
        columnLines: true,
        stripeRows: true
    },
    selModel: {
        allowDeselect: true
    },
    autoShow: true,
    frame: false,
    layout: 'fit',
    useArrows: true,
    rootVisible: false,
    multiSelect: false,
    //singleExpand: true,

    initComponent: function() {
        this.columns = {
            defaults: {
                draggable: false,
                resizable: false,
                hideable: false,
                sortable: false
            },
            items: [{
                text: ' ',
                id: 'shopping_request_columndel',
                width: 40,
                locked: true,
                align: 'center',
                menuDisabled: true,
                sortable: false,
                renderer: function(val, metaData, record, colIndex, store) {
                    if (record !== null) {
                        let id = record.get('id');
                        if (id > 0) {
                            metaData['tdAttr'] = 'data-qtip="Eliminar Solicitud"';
                            metaData.tdCls = 'row-icon';
                            return '<a class="del-request-icon" data-id="' + id + '"><i class="fas fa-minus-circle icon-red"/></a>';
                        } else {
                            return ' ';
                        }
                    }
                }
            }, {
                header: 'PDF',
                width: 50,
                align: 'center',
                locked: true,
                menuDisabled: true,
                sortable: false,
                renderer: function(val, metaData, record, colIndex, store) {
                    if (record !== null) {
                        let id = record.get('id'),
                            doc = record.get('document'),
                            code = record.get('codedb');
                        if (id > 0) {
                            if (doc != '' && doc != null) {
                                metaData['tdAttr'] = 'data-qtip="Clic para Actualizar Documentaci\xF3n Escaneada PDF"';
                                metaData.tdCls = 'row-icon';
                                let token = localStorage.getItem('phshopping_form');
                                return '<form id="load-requestpdf-' + id + '" enctype="multipart/form-data" class="form-horizontal" role="form">' +
                                    '<input name="_token" value="' + token + '" type="hidden">' +
                                    '<input name="id_request" type="hidden" value="' + id + '">' +
                                    '<input name="code_request" type="hidden" value="' + code + '">' +
                                    '<span class="fileinput-grid">' +
                                    '<span id="search-btn-' + id + '">' +
                                    '<i class="fas fa-file-pdf icon-red"></i>' +
                                    '</span>' +
                                    '<input id="request-pdf-' + id + '" class="request-pdf" type="file" name="document" accept=".pdf">' +
                                    '</span>' +
                                    '</form>';
                            } else {
                                metaData['tdAttr'] = 'data-qtip="Clic para Agregar Documentaci\xF3n Escaneada PDF"';
                                metaData.tdCls = 'row-icon';
                                let token = localStorage.getItem('phshopping_form');
                                return '<form id="load-requestpdf-' + id + '" enctype="multipart/form-data" class="form-horizontal" role="form">' +
                                    '<input name="_token" value="' + token + '" type="hidden">' +
                                    '<input name="id_request" type="hidden" value="' + id + '">' +
                                    '<input name="code_request" type="hidden" value="' + code + '">' +
                                    '<span class="fileinput-grid">' +
                                    '<span id="search-btn-' + id + '">' +
                                    '<i class="fas fa-file-pdf icon-gray"></i>' +
                                    '</span>' +
                                    '<input id="request-pdf-' + id + '" class="request-pdf" type="file" name="document" accept=".pdf">' +
                                    '</span>' +
                                    '</form>';
                            }
                        } else {
                            return;
                        }
                    }
                }
            }, {
                xtype: 'treecolumn',
                id: 'request_treecolumn',
                text: 'No. Modelo 711',
                cls: '',
                dataIndex: 'code',
                locked: true,
                align: 'left',
                width: 140,
                /*renderer: function(val, metaData, record, colIndex, store) {
                    if (record.get('parent') != null && record.get('parent') != '') {
                        metaData.tdCls = 'text-green';
                        return val;
                    }
                    else {
                        metaData.tdCls = 'text-land';
                        return val;
                    }
                }*/
            }, {
                text: 'Proyecto',
                dataIndex: 'works_abbr',
                align: 'center',
                locked: true,
                menuDisabled: true,
                sortable: true,
                width: 100
            }, {
                text: 'Fecha',
                dataIndex: 'request_date',
                align: 'center',
                menuDisabled: true,
                sortable: true,
                width: 100
            }, {
                text: 'Nombre',
                dataIndex: 'name',
                align: 'left',
                menuDisabled: true,
                sortable: true,
                width: 300,
                renderer: function(val, metaData, record, colIndex, store) {
                    metaData['tdAttr'] = 'data-qtip="' + val + '"';
                    return val;
                }
            }, {
                text: 'Departamento',
                dataIndex: 'department',
                align: 'center',
                menuDisabled: true,
                sortable: true,
                width: 150
            }, {
                text: 'C. Gesti\xF3n',
                dataIndex: 'management_code',
                align: 'center',
                width: 110
            }, {
                text: 'Observaciones',
                dataIndex: 'comment',
                align: 'left',
                flex: 1,
                minWidth: 300,
                renderer: function(val, metaData, record, colIndex, store) {
                    if (record.get('comment') != null && record.get('comment') != '') {
                        metaData['tdAttr'] = 'data-qtip="' + val + '"';
                        return val;
                    } else {
                        return;
                    }
                }
            }]
        };

        this.callParent();

        let work = Ext.getCmp('shoppworkscombo').getValue(),
            dpto = Ext.getCmp('shoppdptoscombo').getValue(),
            month = Ext.getCmp('shopp711monthcombo').getValue(),
            year = Ext.getCmp('shopp711yearcombo').getValue(),
            user = 0;

        if (work == null || work == '') { work = -1; }
        if (dpto == null || dpto == '') { dpto = -1; }

        if (localStorage.getItem('phcp_ui') && localStorage.getItem('phcp_ui') > 0) {
            user = localStorage.getItem('phcp_ui');
        }

        // Load Store
        let proxy = this.getStore().getProxy();
        Ext.apply(proxy.api, {
            read: '/phnet.compras/public/api/shopping/requests/' + user + '/' + work + '/' + dpto + '/' + month + '/' + year
        });
        this.getStore().load();
    }
});