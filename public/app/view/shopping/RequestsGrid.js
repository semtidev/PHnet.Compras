// Location UX
Ext.Loader.setPath('Ext.ux', 'extjs42/includes/ux/');
let request_treestore = Ext.create('PHNet.store.shopping.Requests', {
    storeId: 'requestreestore'
});

Ext.define('PHNet.view.shopping.RequestsGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'requestsgrid',
    id: 'requestsgrid',
    store: request_treestore,
    listeners: {
        'selectionchange': function(selectionModel, records, eOpts) {

            var me = this;

            Ext.getCmp('shopp-info-confirm').setVisible(false);
            Ext.getCmp('shopp-info-approve').setVisible(false);
            Ext.getCmp('shopp-info-reject').setVisible(false);

            if (records[0]) {

                let grid = Ext.getCmp('shopp711tab'),
                    project = Ext.getCmp('shoppworkscombo').getValue(),
                    approvedate = records[0].data.approved,
                    user_reqadd = records[0].data.created,
                    user_dpto = localStorage.getItem('phcp_ud');

                user_reqdpto = records[0].data.dpto_ids.split(',');

                if (project == -1) {
                    project = records[0].data.work_id;
                }

                if (records[0].data.parent == null || records[0].data.parent == '') {
                    Ext.getCmp('shopp-btn-exp').setDisabled(false);
                } else {
                    Ext.getCmp('shopp-btn-exp').setDisabled(true);
                }

                if (records[0].data.parent == null || records[0].data.parent == '') {

                    if ((user_roles.includes('Especialista de Obra') && records[0].data.created == 1) || (user_roles.includes('Especialista de Compras') && records[0].data.created == 1) || (user_roles.includes('Jefe de Departamento') && user_reqdpto.includes(user_dpto) && user_works.includes(project.toString()))) {

                        Ext.getCmp('shopp-btn-upd').setVisible(true);
                        Ext.getCmp('shopp-btn-del').setVisible(true);
                        // Confirm Request Especialist & Department
                        if (user_roles.includes('Especialista de Obra') && records[0].data.esp_confirm == 0) {
                            Ext.getCmp('shopp-btn-confirm').setVisible(true);
                        }
                        if (user_roles.includes('Especialista de Compras') && records[0].data.esp_confirm == 0) {
                            Ext.getCmp('shopp-btn-confirm').setVisible(true);
                        }
                        if (user_roles.includes('Jefe de Departamento') && records[0].data.dpto_confirm == 0) {
                            Ext.getCmp('shopp-btn-confirm').setVisible(true);
                        }
                        // Show Msg Confirm
                        if (user_roles.includes('Especialista de Obra') && records[0].data.esp_confirm == 1) {
                            Ext.getCmp('shopp-info-confirm').setVisible(true);
                        }
                        if (user_roles.includes('Especialista de Compras') && records[0].data.esp_confirm == 1) {
                            Ext.getCmp('shopp-info-confirm').setVisible(true);
                        }
                        if (user_roles.includes('Jefe de Departamento') && records[0].data.dpto_confirm == 1) {
                            Ext.getCmp('shopp-info-confirm').setVisible(true);
                        }

                    } else {

                        Ext.getCmp('shopp-btn-upd').setVisible(false);
                        Ext.getCmp('shopp-btn-del').setVisible(false);
                        Ext.getCmp('shopp-btn-confirm').setVisible(false);
                        Ext.getCmp('shopp-btn-approve').setVisible(false);
                        Ext.getCmp('shopp-btn-reject').setVisible(false);

                        // Confirm Request Shopping Department
                        if (user_roles.includes('Jefe de Compras') && records[0].data.comp_comfirm == 0) {
                            Ext.getCmp('shopp-btn-confirm').setVisible(true);
                        }
                        // Show Msg Confirm
                        if (user_roles.includes('Jefe de Compras') && records[0].data.comp_comfirm == 1) {
                            Ext.getCmp('shopp-info-confirm').setVisible(true);
                        }

                        // Confirm Request CH Project Director
                        if (user_roles.includes('Directivo CH') && records[0].data.work_abbr != 'TDC' && records[0].data.dir_confirm == 0) {
                            Ext.getCmp('shopp-btn-confirm').setVisible(true);
                        }
                        // Show Msg Confirm
                        if (user_roles.includes('Directivo CH') && records[0].data.work_abbr != 'TDC' && records[0].data.dir_confirm == 1) {
                            Ext.getCmp('shopp-info-confirm').setVisible(true);
                        }

                        // Confirm Request TDC Project Director
                        if (user_roles.includes('Directivo TDC') && records[0].data.work_abbr == 'TDC' && records[0].data.dir_confirm == 0) {
                            Ext.getCmp('shopp-btn-confirm').setVisible(true);
                        }
                        // Show Msg Confirm
                        if (user_roles.includes('Directivo TDC') && records[0].data.work_abbr == 'TDC' && records[0].data.dir_confirm == 1) {
                            Ext.getCmp('shopp-info-confirm').setVisible(true);
                        }

                        // Aproved/Reject Request General Director
                        if (user_roles.includes('Director UBPH') && records[0].data.gendir_aprove == 0 && records[0].data.gendir_reject == 0) {
                            Ext.getCmp('shopp-btn-approve').setVisible(true);
                        }
                        if (user_roles.includes('Director UBPH') && records[0].data.gendir_reject == 0 && records[0].data.gendir_aprove == 0) {
                            Ext.getCmp('shopp-btn-reject').setVisible(true);
                        }
                        // Show Msg Approve
                        if (user_roles.includes('Director UBPH') && records[0].data.gendir_aprove == 1) {
                            Ext.getCmp('shopp-info-approve').setVisible(true);
                        }
                        // Show Msg Reject
                        if (user_roles.includes('Director UBPH') && records[0].data.gendir_reject == 1) {
                            Ext.getCmp('shopp-info-reject').setVisible(true);
                        }

                    }

                } else {

                    Ext.getCmp('shopp-btn-upd').setVisible(false);
                    Ext.getCmp('shopp-btn-del').setVisible(false);
                    Ext.getCmp('shopp-btn-confirm').setVisible(false);
                    Ext.getCmp('shopp-btn-approve').setVisible(false);
                    Ext.getCmp('shopp-btn-reject').setVisible(false);
                }

                me.fireEvent('requestselect', approvedate, user_reqadd);

                // Delete, Update, Confirm, Approve or Deject Request
                /*Ext.Ajax.request({
                    url: '/phnet.compras/public/api/shopping/request/rolstate',
                    method: 'POST',
                    params: {
                        id_request: records[0].data.id,
                        id_user: localStorage.getItem('phcp_ui')
                    },
                    success: function(result, request) {
                        let jsonData = Ext.JSON.decode(result.responseText);
                        if (jsonData.failure) {
                            Ext.MessageBox.show({
                                title: 'Mensaje del Sistema',
                                msg: 'Ha ocurrido un error al consultar el Estado de esta Solicitud. Presione la tecla F5 de su teclado para que todo inicie nuevamente. Si el problema persiste póngase en contacto con el <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                                buttons: Ext.MessageBox.OK,
                                icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                            });
                        } else {

                            let user_dpto = localStorage.getItem('phcp_ud');

                            if (jsonData.created == 1) {
                                user_reqadd = 1;
                            }

                            if (project == -1) {
                                project = records[0].data.work_id;
                            }

                            user_reqwork = project;

                            

                            if (records[0].data.parent == null || records[0].data.parent == '') {


                                if (!user_roles.includes('Director UBPH')) {
                                    Ext.getCmp('shopp-btn-approve').setVisible(false);

                                    if (((user_roles.includes('Jefe de Departamento') && user_reqdpto.includes(user_dpto)) || user_roles.includes('Jefe de Compras') || (user_roles.includes('Directivo CH') && records[0].data.work_abbr != 'TDC') || (user_roles.includes('Directivo TDC') && records[0].data.work_abbr == 'TDC'))) {

                                        // Btn Confirm & Reject
                                        if (jsonData.confirmed == 0) {
                                            Ext.getCmp('shopp-btn-confirm').setVisible(true);
                                            Ext.getCmp('shopp-btn-reject').setVisible(true);
                                        } else {
                                            Ext.getCmp('shopp-btn-confirm').setVisible(false);
                                            Ext.getCmp('shopp-info-confirm').setVisible(true);
                                            Ext.getCmp('shopp-btn-reject').setVisible(false);
                                        }
                                    } else {
                                        Ext.getCmp('shopp-btn-confirm').setVisible(false);
                                        Ext.getCmp('shopp-info-confirm').setVisible(false);
                                        Ext.getCmp('shopp-btn-reject').setVisible(false);
                                    }
                                } else {
                                    Ext.getCmp('shopp-btn-confirm').setVisible(false);

                                    // Btn Approve & Reject
                                    if (jsonData.approved == 0 && jsonData.rejected == 0) {
                                        Ext.getCmp('shopp-btn-approve').setVisible(true);
                                        Ext.getCmp('shopp-btn-reject').setVisible(true);
                                    } else if (jsonData.approved == 1 && jsonData.rejected == 0) {
                                        Ext.getCmp('shopp-btn-approve').setVisible(false);
                                        Ext.getCmp('shopp-btn-reject').setVisible(false);
                                        Ext.getCmp('shopp-info-approve').setVisible(true);
                                    } else {
                                        Ext.getCmp('shopp-btn-approve').setVisible(false);
                                        Ext.getCmp('shopp-btn-reject').setVisible(false);
                                        Ext.getCmp('shopp-info-reject').setVisible(true);
                                    }
                                }
                            }

                            me.fireEvent('requestselect', approvedate, user_reqadd);
                        }
                    },
                    failure: function() {
                        Ext.MessageBox.show({
                            title: 'Mensaje del Sistema',
                            msg: 'Ha ocurrido un error al consultar el Estado de esta Solicitud. Presione la tecla F5 de su teclado para que todo inicie nuevamente. Si el problema persiste póngase en contacto con el <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                            buttons: Ext.MessageBox.OK,
                            icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                        });
                    }
                });*/
            } else {
                Ext.getCmp('shopp-btn-exp').setDisabled(true);
                this.fireEvent('unselect');
            }

        }
    },
    viewConfig: {
        columnLines: true,
        stripeRows: true
    },
    autoShow: true,
    autoScroll: false,
    frame: false,
    layout: 'fit',

    initComponent: function() {

        this.columns = {
            defaults: {
                draggable: false,
                resizable: false,
                hideable: false,
                sortable: false
            },
            items: [{
                xtype: 'rownumberer',
                text: 'No.',
                width: 45,
                align: 'center'
            }, {
                header: 'PDF',
                width: 50,
                align: 'center',
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
                                    '<i class="fas fa-file-pdf icon-pdf"></i>' +
                                    '</span>' +
                                    '<input id="request-pdf-' + id + '" class="request-pdf" type="file" name="document" accept=".pdf" title=" ">' +
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
                                    '<i class="fas fa-file-pdf icon-gray2"></i>' +
                                    '</span>' +
                                    '<input id="request-pdf-' + id + '" class="request-pdf" type="file" name="document" accept=".pdf" title=" ">' +
                                    '</span>' +
                                    '</form>';
                            }
                        } else {
                            return;
                        }
                    }
                }
            }, {
                header: 'C\xF3digo 711',
                id: 'request-grid-code',
                dataIndex: 'code',
                align: 'left',
                width: 130,
                renderer: function(val, metaData, record, colIndex, store) {
                    let totalcomments = record.get('totalcomments'),
                        badge = '',
                        badge_tip = '';
                    if (totalcomments > 0) {
                        badge = '<span class="badge info"><i class="fas fa-comments fa-sm"></i></span>';
                        badge_tip = ' | ' + totalcomments + ' Comentarios';
                    }
                    if (record.get('parent') != null && record.get('parent') != '') {
                        //metaData.tdCls = 'text-gray';
                        metaData['tdAttr'] = 'data-qtip="Distribuci\xF3n de Productos"';
                        let left = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                        return left + val;
                    } else {
                        let text_color = 'text-gray',
                            status = 'Solicitud Pendiente de Aprobaci\xF3n',
                            left = '';

                        if (record.get('gendir_reject') == 1) {
                            text_color = 'text-red';
                            status = 'Solicitud Rechazada';
                        }
                        if (record.get('gendir_aprove') == 1) {
                            text_color = 'text-green';
                            status = 'Solicitud Aprobada'
                        }

                        left = '<i class="fas fa-shopping-cart icon-list ' + text_color + '"></i>&nbsp;&nbsp;';

                        metaData['tdAttr'] = 'data-qtip="' + status + badge_tip + '"';

                        return left + '<span class="shopp-model-text ' + text_color + '">' + val + badge + '</span> ';
                    }
                }
            }, {
                text: 'Obra',
                dataIndex: 'work_abbr',
                align: 'center',
                menuDisabled: true,
                sortable: true,
                width: 80,
                renderer: function(val, metaData, record, colIndex, store) {
                    metaData['tdAttr'] = 'data-qtip="' + record.get('work_name') + '"';
                    return val;
                }
            }, {
                text: 'Fecha',
                dataIndex: 'document_date',
                align: 'center',
                menuDisabled: true,
                sortable: true,
                width: 100
            }, {
                text: 'Descripci\xF3n',
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
                text: 'Departamento(s)',
                dataIndex: 'department',
                align: 'center',
                menuDisabled: true,
                sortable: true,
                width: 150,
                renderer: function(val, metaData, record, colIndex, store) {
                    metaData['tdAttr'] = 'data-qtip="' + val + '"';
                    return val;
                }
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
            user = 0;

        if (work == null || work == '') { work = -1; }
        if (dpto == null || dpto == '') { dpto = -1; }

        if (localStorage.getItem('phcp_ui') && localStorage.getItem('phcp_ui') > 0) {
            user = localStorage.getItem('phcp_ui');
        }

        // Load Store
        let proxy = this.getStore().getProxy();
        Ext.apply(proxy.api, {
            read: '/phnet.compras/public/api/shopping/requests/' + user + '/' + work + '/' + dpto
        });
        this.getStore().load();
        /*this.getStore().sort([ {
        	property : 'id',
        	direction: 'DESC'
        	}
        ]);*/
    }
});