Ext.define('PHNet.controller.shopping.Tracking', {
    extend: 'Ext.app.Controller',
    models: [],
    stores: [],
    views: [
        'tracking.TrackingNatWindow',
        'tracking.TrackingNatGrid',
        'tracking.TrackingImpWindow',
        'tracking.TrackingImpGrid',
        'tracking.ExportExcelWindow',
        'tracking.TrackingContextMenu'
    ],
    refs: [{
            ref: 'trackingnatwindow',
            selector: 'trackingnatwindow'
        },
        {
            ref: 'trackingnatgrid',
            selector: 'trackingnatgrid'
        },
        {
            ref: 'trackingimpwindow',
            selector: 'trackingimpwindow'
        },
        {
            ref: 'trackingimpgrid',
            selector: 'trackingimpgrid'
        },
        {
            ref: 'exportexcelwindow',
            selector: 'exportexcelwindow'
        },
        {
            ref: 'trackingcontextmenu',
            selector: 'trackingcontextmenu'
        }
    ],
    init: function() {

        this.control({
            'trackingnatgrid button[action=reload]': {
                click: this.reloadTrackingGrid
            },
            'trackingimpgrid button[action=reload]': {
                click: this.reloadTrackingGrid
            },
            'trackingnatgrid radiofield[name=filter_menu_circuit_radio]': {
                change: this.filterCircuit
            },
            'trackingimpgrid radiofield[name=filter_menu_circuit_radio]': {
                change: this.filterCircuit
            },
            'trackingnatgrid radiofield[name=filter_menu_state_radio]': {
                change: this.filterState
            },
            'trackingimpgrid radiofield[name=filter_menu_state_radio]': {
                change: this.filterState
            },
            'trackingnatgrid menu[lid=trackingnatFilterMenu] menuitem[lid=trackingnatFilter]': {
                click: this.createFilter
            },
            'trackingimpgrid menu[lid=trackingimpFilterMenu] menuitem[lid=trackingimpFilter]': {
                click: this.createFilter
            },
            'trackingnatgrid menu[lid=trackingnatFilterMenu] menuitem[lid=trackingnatNoFilter]': {
                click: this.deleteFilter
            },
            'trackingimpgrid menu[lid=trackingimpFilterMenu] menuitem[lid=trackingimpNoFilter]': {
                click: this.deleteFilter
            },
            'trackingnatgrid menu[lid=trackingnatExportMenu] menuitem[lid=trackingnatExcel]': {
                click: this.configExportExcel
            },
            'trackingimpgrid menu[lid=trackingimpExportMenu] menuitem[lid=trackingimpExcel]': {
                click: this.configExportExcel
            },
            'trackingnatgrid menu[lid=trackingnatExportMenu] menuitem[lid=trackingnatPDF]': {
                click: this.configExportPDF
            },
            'trackingimpgrid menu[lid=trackingimpExportMenu] menuitem[lid=trackingimpPDF]': {
                click: this.configExportPDF
            },
            '#trackingnatworkcombo': {
                change: this.loadComboTrackingnat
            },
            '#trackingimpworkcombo': {
                change: this.loadComboTrackingnat
            },
            '#trackingnatdptocombo': {
                change: this.loadComboTrackingnat
            },
            '#trackingimpdptocombo': {
                change: this.loadComboTrackingnat
            },
            '#trackingnatmonthcombo': {
                change: this.loadComboTrackingnat
            },
            '#trackingimpmonthcombo': {
                change: this.loadComboTrackingnat
            },
            '#trackingnatyearcombo': {
                change: this.loadComboTrackingnat
            },
            '#trackingimpyearcombo': {
                change: this.loadComboTrackingnat
            },
            'trackingnatgrid': {
                recordedit: this.updTracking,
                itemcontextmenu: this.showContextMenu,
                search: this.filterSearch
            },
            'trackingimpgrid': {
                recordedit: this.updTracking,
                itemcontextmenu: this.showContextMenu,
                search: this.filterSearch
            },
            '#track-filter-canceled': {
                change: this.filterCanceled
            },
            'filterform button[action=setfilterclose]': {
                click: this.setFilter
            },
            'exportexcelwindow button[action=export]': {
                click: this.exportExcel
            },
            'exportpdfwindow button[action=export]': {
                click: this.exportPDF
            },
            '#trackmenu_circuit': {
                itemclick: this.handleRequestState
            },
            '#trackmenu_offer': {
                itemclick: this.handleRequestState
            },
            '#trackmenu_contract': {
                itemclick: this.handleRequestState
            },
            '#trackmenu_supply': {
                itemclick: this.handleRequestState
            },
            '#trackcomment': {
                itemclick: this.handleCommentRequest
            },
            '#trackshowcomment': {
                itemclick: this.handleShowCommentsRequest
            },
            '#menu-ubidate': {
                ubidate: this.handleUbiDate
            },
            '#menu-cancel-request': {
                itemclick: this.handleCancelRequest
            },
            'requestcancelwindow button[action=cancel]': {
                click: this.cancelRequest
            },
            '#menu-active-request': {
                itemclick: this.handleActiveRequest
            }
        });
    },

    showContextMenu: function(view, record, node, rowIndex, e) {

        if (!record.data.leaf) {
            Ext.destroy(Ext.getCmp('trackingcontextmenu'));
            let contextMenu = Ext.create('PHNet.view.tracking.TrackingContextMenu'),
                user_dpto = localStorage.getItem('phcp_ud');
            if (user_dpto != 5) {
                contextMenu.remove('menu-tracking-state');
                contextMenu.remove('menu-ubidate');
                contextMenu.remove('menu-cancel-request');
                contextMenu.remove('menu-active-request');
            }
            if (Ext.getCmp('track-filter-canceled').getValue() == true) {
                contextMenu.remove('menu-cancel-request');
            } else {
                contextMenu.remove('menu-active-request');
            }
            contextMenu.setList(record);
            contextMenu.showAt(e.getX(), e.getY());
        }
        e.preventDefault();
    },

    handleRequestState: function(item) {

        let window = Ext.getCmp(localStorage.getItem('phcp_win_id')),
            grid = window.down('treepanel'),
            record = grid.getSelectionModel().getSelection()[0],
            itemstate = item.id,
            state;

        switch (itemstate) {
            case 'trackmenu_circuit':
                state = 1;
                break;
            case 'trackmenu_offer':
                state = 2;
                break;
            case 'trackmenu_contract':
                state = 3;
                break;
            default:
                state = 4;
                break;
        }

        Ext.Ajax.request({
            url: '/phnet.compras/public/api/tracking/state',
            method: 'POST',
            params: { id: record.data.id, state: state },
            success: function() {
                grid.getStore().load({
                    callback: function(records, operation, success) {
                        grid.getSelectionModel().deselect(records, true);
                    }
                });
            },
            failure: function() {
                Ext.MessageBox.show({
                    title: 'Mensaje del Sistema',
                    msg: 'Ha ocurrido un error en el Sistema. Por favor, vuelva a intentar realizar la operacion, de continuar el problema consulte al <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                    buttons: Ext.MessageBox.OK,
                    icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                });
            }
        });
    },

    reloadTrackingGrid: function(button) {

        let win = button.up('window'),
            grid = win.down('treepanel'),
            type = grid.getId(),
            proxy = grid.getStore().getProxy();

        if (type == 'trackingnatgrid') {
            type = 'national';
            work = Ext.getCmp('trackingnatworkcombo').getValue();
            dpto = Ext.getCmp('trackingnatdptocombo').getValue();
            /*month = parseInt(Ext.getCmp('trackingnatmonthcombo').getValue()),
            year  = Ext.getCmp('trackingnatyearcombo').getValue();*/
        } else {
            type = 'import';
            work = Ext.getCmp('trackingimpworkcombo').getValue();
            dpto = Ext.getCmp('trackingimpdptocombo').getValue();
            /*month = parseInt(Ext.getCmp('trackingimpmonthcombo').getValue()),
            year  = Ext.getCmp('trackingimpyearcombo').getValue();*/
        }

        if (localStorage.getItem('tracking_filter')) {
            Ext.apply(proxy.api, {
                read: '/phnet.compras/public/api/tracking/' + type + '/' + work + '/' + dpto + '/1'
            });
        } else {
            Ext.apply(proxy.api, {
                read: '/phnet.compras/public/api/tracking/' + type + '/' + work + '/' + dpto
            });
        }

        grid.getStore().load({
            callback: function(records, operation, success) {
                grid.getSelectionModel().deselect(records, true);
                $('.x-grid-row').removeClass('x-grid-row-selected');
                $('.x-grid-row').removeClass('x-grid-row-focused');
                $('.x-grid-row').removeClass('x-grid-row-over');
            }
        });
    },

    filterSearch: function(search) {
        let win = Ext.getCmp('search_tracking_field').up('window'),
            grid = win.down('treepanel'),
            type = grid.getId(),
            proxy = grid.getStore().getProxy();

        if (type == 'trackingnatgrid') {
            type = 'national';
            work = Ext.getCmp('trackingnatworkcombo').getValue();
            dpto = Ext.getCmp('trackingnatdptocombo').getValue();
        } else {
            type = 'import';
            work = Ext.getCmp('trackingimpworkcombo').getValue();
            dpto = Ext.getCmp('trackingimpdptocombo').getValue();
        }

        Ext.apply(proxy.api, {
            read: '/phnet.compras/public/api/tracking/' + type + '/' + work + '/' + dpto + '/0/' + search
        });

        grid.getStore().load({
            callback: function(records, operation, success) {
                grid.getSelectionModel().deselect(records, true);
                $('.x-grid-row').removeClass('x-grid-row-selected');
                $('.x-grid-row').removeClass('x-grid-row-focused');
                $('.x-grid-row').removeClass('x-grid-row-over');
                localStorage.setItem('tracking_filter', 'yes');
                Ext.getCmp('box-tracking-filter').setVisible(true);
                Ext.getCmp('menu-filter-remove').setVisible(true);
                Ext.getCmp('filter-circuit-all').setValue(true);
                Ext.getCmp('filter-state-all').setValue(true);
            }
        });
    },

    filterCanceled: function(check, newValue, oldValue, eOptsparams) {

        let win = check.up('window'),
            grid = win.down('treepanel'),
            type = grid.getId(),
            search = '-1',
            proxy = grid.getStore().getProxy();

        if (type == 'trackingnatgrid') {
            type = 'national';
            work = Ext.getCmp('trackingnatworkcombo').getValue();
            dpto = Ext.getCmp('trackingnatdptocombo').getValue();
        } else {
            type = 'import';
            work = Ext.getCmp('trackingimpworkcombo').getValue();
            dpto = Ext.getCmp('trackingimpdptocombo').getValue();
        }

        switch (newValue) {
            case true:
                active = '/0'
                break;
            default:
                active = '/1'
                break;
        }

        Ext.apply(proxy.api, {
            read: '/phnet.compras/public/api/tracking/' + type + '/' + work + '/' + dpto + '/0/' + search + '/all' + active
        });
        grid.getStore().load({
            callback: function(records, operation, success) {
                grid.getSelectionModel().deselect(records, true);
                $('.x-grid-row').removeClass('x-grid-row-selected');
                $('.x-grid-row').removeClass('x-grid-row-focused');
                $('.x-grid-row').removeClass('x-grid-row-over');
                localStorage.setItem('tracking_filter', 'yes');
                Ext.getCmp('box-tracking-filter').setVisible(newValue);
                Ext.getCmp('menu-filter-remove').setVisible(newValue);
                Ext.getCmp('search_tracking_field').setValue(null);
            }
        });
    },

    filterState: function(radiofield, newValue, oldValue, eOpts) {

        if (radiofield.getValue()) {

            let win = Ext.getCmp(localStorage.getItem('phcp_win_id')),
                grid = win.down('treepanel'),
                proxy = grid.getStore().getProxy(),
                idfield = radiofield.getId(),
                state = -1,
                search = '-1',
                type = grid.getId(),
                searchfield = Ext.getCmp('search_tracking_field').getValue();

            switch (idfield) {
                case 'filter-state-circuit':
                    state = 1
                    break;
                case 'filter-state-offert':
                    state = 2
                    break;
                case 'filter-state-contract':
                    state = 3
                    break;
                case 'filter-state-supplied':
                    state = 4
                    break;
                default:
                    state = -1
                    break;
            }

            if (searchfield != null && searchfield != '') {
                search = searchfield
            }

            if (type == 'trackingnatgrid') {
                type = 'national';
                work = Ext.getCmp('trackingnatworkcombo').getValue();
                dpto = Ext.getCmp('trackingnatdptocombo').getValue();
            } else {
                type = 'import';
                work = Ext.getCmp('trackingimpworkcombo').getValue();
                dpto = Ext.getCmp('trackingimpdptocombo').getValue();
            }

            Ext.apply(proxy.api, {
                read: '/phnet.compras/public/api/tracking/' + type + '/' + work + '/' + dpto + '/0/' + search + '/all/1/' + state
            });

            grid.getStore().load({
                callback: function(records, operation, success) {
                    grid.getSelectionModel().deselect(records, true);
                    $('.x-grid-row').removeClass('x-grid-row-selected');
                    $('.x-grid-row').removeClass('x-grid-row-focused');
                    $('.x-grid-row').removeClass('x-grid-row-over');
                    if (state != -1) {
                        localStorage.setItem('tracking_filter', 'yes');
                        Ext.getCmp('box-tracking-filter').setVisible(true);
                        Ext.getCmp('menu-filter-remove').setVisible(true);
                    }
                    if (state != 1) {
                        Ext.getCmp('filter-circuit-all').setValue(true);
                    }
                }
            });

        } else {
            return false;
        }
    },

    filterCircuit: function(radiofield, newValue, oldValue, eOpts) {

        if (radiofield.getValue()) {

            let win = Ext.getCmp('search_tracking_field').up('window'),
                grid = win.down('treepanel'),
                proxy = grid.getStore().getProxy(),
                idfield = radiofield.getId(),
                circuit = '',
                state = '-1',
                search = '-1',
                type = grid.getId(),
                searchfield = Ext.getCmp('search_tracking_field').getValue();

            switch (idfield) {
                case 'filter-circuit-pending':
                    circuit = 'pending'
                    break;
                case 'filter-circuit-approved':
                    circuit = 'approved'
                    break;
                case 'filter-circuit-rejected':
                    circuit = 'rejected'
                    break;
                default:
                    circuit = 'all'
                    break;
            }

            if (searchfield != null && searchfield != '') {
                search = searchfield
            }

            if (type == 'trackingnatgrid') {
                type = 'national';
                work = Ext.getCmp('trackingnatworkcombo').getValue();
                dpto = Ext.getCmp('trackingnatdptocombo').getValue();
            } else {
                type = 'import';
                work = Ext.getCmp('trackingimpworkcombo').getValue();
                dpto = Ext.getCmp('trackingimpdptocombo').getValue();
            }

            if (circuit != 'all') {
                state = '1';
                Ext.apply(proxy.api, {
                    read: '/phnet.compras/public/api/tracking/' + type + '/' + work + '/' + dpto + '/0/' + search + '/' + circuit + '/' + state
                });
            } else {
                Ext.apply(proxy.api, {
                    read: '/phnet.compras/public/api/tracking/' + type + '/' + work + '/' + dpto
                });
            }


            grid.getStore().load({
                callback: function(records, operation, success) {
                    grid.getSelectionModel().deselect(records, true);
                    $('.x-grid-row').removeClass('x-grid-row-selected');
                    $('.x-grid-row').removeClass('x-grid-row-focused');
                    $('.x-grid-row').removeClass('x-grid-row-over');
                    if (circuit != 'all') {
                        localStorage.setItem('tracking_filter', 'yes');
                        Ext.getCmp('box-tracking-filter').setVisible(true);
                        Ext.getCmp('menu-filter-remove').setVisible(true);
                        Ext.getCmp('filter-state-circuit').setValue(true);
                    }
                }
            });

        } else {
            return false;
        }
    },

    createFilter: function(item) {

        let createForm = Ext.create('PHNet.view.tracking.FilterForm'),
            form = createForm.down('form');
        request_type = Ext.getCmp('filterFormType');

        request_type.setValue(item.getItemId());
        createForm.show();

        if (localStorage.getItem('tracking_filter') && localStorage.getItem('tracking_filter') == 'yes') {
            form.getForm().load({
                url: '/phnet.compras/public/api/tracking/filter/loadForm',
                method: 'POST',
                failure: function(form, action) {
                    editor.close();
                    Ext.Msg.alert('Carga Fallida', 'La carga de los parametros filtrados no se ha realizado. Por favor, intentelo de nuevo, de mantenerse el problema contacte con el <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.');
                }
            });
        }
    },

    setFilter: function(button) {

        let win = button.up('window'),
            form = win.down('form'),
            values = form.getValues(),
            grid, type, cmp, work, dpto;

        if (values.request_type == 'trackingnatFilter') {
            grid = this.getTrackingnatgrid(), type = 'national', cmp = 'trackingnat';
        } else {
            grid = this.getTrackingimpgrid(), type = 'import', cmp = 'trackingimp';
        }

        if (form.isValid()) {

            if (values.description != '' || values.code != '' || values.created_start != '' || values.created_end != '' || values.ubi_start != '' || values.ubi_end || values.state != -1 || values.quote != 'all') {

                button.setText('Filtrando...');
                button.setDisabled(true);
                Ext.getCmp('filterform-cancelbtn').setDisabled(true);


                work = Ext.getCmp(cmp + 'workcombo').getValue();
                dpto = Ext.getCmp(cmp + 'dptocombo').getValue();

                form.getForm().submit({
                    method: 'POST',
                    url: '/phnet.compras/public/api/tracking/filter',
                    params: {
                        work: work,
                        dpto: dpto
                    },
                    success: function(form, action) {
                        let data = Ext.decode(action.response.responseText);
                        Ext.getCmp('filterbtn').down('menu').down().setIconCls('fas fa-check');
                        Ext.getCmp('menu-filter-remove').setVisible(true);
                        button.setText('<i class="fas fa-check"></i>&nbsp;Aceptar');
                        button.setDisabled(false);
                        Ext.getCmp('filterform-cancelbtn').setDisabled(false);
                        win.close();
                        // Load Store
                        let proxy = grid.getStore().getProxy();
                        Ext.apply(proxy.api, {
                            read: '/phnet.compras/public/api/tracking/' + type + '/' + work + '/' + dpto + '/1'
                        });
                        grid.getStore().load();
                        localStorage.setItem('tracking_filter', 'yes');
                        Ext.getCmp('box-tracking-filter').setVisible(true);
                    },
                    failure: function(form, action) {
                        let data = Ext.decode(action.response.responseText);
                        Ext.MessageBox.show({
                            title: 'Mensaje del Sistema',
                            msg: data.message,
                            icon: 'fas fa-exclamation-triangle fa-2x dlg-error',
                            buttons: Ext.Msg.OK
                        });
                        button.setText('<i class="fas fa-check"></i>&nbsp;Aceptar');
                        button.setDisabled(false);
                        Ext.getCmp('filterform-cancelbtn').setDisabled(false);
                    }
                });
            } else {
                Ext.example.msgError('Ops, ha olvidado algo...', 'No ha definido ning\xFAn criterio de b\xFAsqueda para filtrar.');
            }
        }
    },

    deleteFilter: function(item) {

        let itemId = item.getItemId(),
            grid, type, cmp;

        if (itemId == 'trackingnatNoFilter') {
            grid = this.getTrackingnatgrid(), type = 'national', cmp = 'trackingnat';
        } else {
            grid = this.getTrackingimpgrid(), type = 'import', cmp = 'trackingimp';
        }

        Ext.getCmp(cmp + 'workcombo').setMargin('2 0 2 5');
        Ext.getCmp(cmp + 'dptocombo').setMargin('2 0 2 5');

        work = Ext.getCmp(cmp + 'workcombo').getValue();
        dpto = Ext.getCmp(cmp + 'dptocombo').getValue();

        // Load Store
        let proxy = grid.getStore().getProxy();
        Ext.apply(proxy.api, {
            read: '/phnet.compras/public/api/tracking/' + type + '/' + work + '/' + dpto
        });
        grid.getStore().load({
            callback: function(records, operation, success) {
                Ext.getCmp('menu-filter-remove').setVisible(false);
                localStorage.removeItem('tracking_filter');
                Ext.getCmp('box-tracking-filter').setVisible(false);
                Ext.getCmp('search_tracking_field').setValue('');
                Ext.getCmp('track-filter-canceled').setValue(false);
                Ext.getCmp('filter-circuit-all').setValue(true);
                Ext.getCmp('filter-state-all').setValue(true);
            }
        });
    },

    loadComboTrackingnat: function(combo, newValue, oldValue, eOptsparams) {

        let win = combo.up('window'),
            grid = win.down('treepanel'),
            type = grid.getId(),
            proxy = grid.getStore().getProxy();


        if (type == 'trackingnatgrid') {
            type = 'national';
            work = Ext.getCmp('trackingnatworkcombo').getValue(),
                dpto = Ext.getCmp('trackingnatdptocombo').getValue();
            /*,
                        month = parseInt(Ext.getCmp('trackingnatmonthcombo').getValue()),
                        year  = Ext.getCmp('trackingnatyearcombo').getValue();*/
        } else {
            type = 'import';
            work = Ext.getCmp('trackingimpworkcombo').getValue(),
                dpto = Ext.getCmp('trackingimpdptocombo').getValue();
            /*,
                        month = parseInt(Ext.getCmp('trackingimpmonthcombo').getValue()),
                        year  = Ext.getCmp('trackingimpyearcombo').getValue();*/
        }

        switch (combo.getId()) {
            case 'trackingnatworkcombo':
                work = newValue;
                break;
            case 'trackingimpworkcombo':
                work = newValue;
                break;
            case 'trackingnatdptocombo':
                dpto = newValue;
                break;
            case 'trackingimpdptocombo':
                dpto = newValue;
                break;
            case 'trackingnatmonthcombo':
                month = newValue;
                break;
            case 'trackingimpmonthcombo':
                month = newValue;
                break;
            case 'trackingnatyearcombo':
                year = newValue;
                break;
            case 'trackingimpyearcombo':
                year = newValue;
                break;
        }

        Ext.apply(proxy.api, {
            read: '/phnet.compras/public/api/tracking/' + type + '/' + work + '/' + dpto
        });

        grid.getStore().load({
            callback: function(records, operation, success) {
                grid.getSelectionModel().deselect(records, true);
                $('.x-grid-row').removeClass('x-grid-row-selected');
                $('.x-grid-row').removeClass('x-grid-row-focused');
                $('.x-grid-row').removeClass('x-grid-row-over');
            }
        });
    },

    updTracking: function(record) {

        let id_request = record.data.id,
            field = record.field,
            oldvalue = record.oldvalue,
            newvalue = record.newvalue;

        console.log(oldvalue, newvalue);
        if (oldvalue == newvalue) {
            return;
        }

        // Update Tracking
        Ext.Ajax.request({
            url: '/phnet.compras/public/api/tracking/national/upd',
            method: 'PUT',
            params: {
                id_request: id_request,
                field: field,
                value: newvalue
            },
            success: function(result, request) {
                let jsonData = Ext.JSON.decode(result.responseText);
                if (jsonData.failure) {
                    Ext.MessageBox.show({
                        title: 'Mensaje del Sistema',
                        msg: jsonData.message,
                        buttons: Ext.MessageBox.OK,
                        icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                    });
                }
                /* else {
                                    Ext.example.msgScs('Se ha Actualizado el Seguimiento Satisfactoriamente.');
                                }*/
            },
            failure: function() {
                Ext.MessageBox.show({
                    title: 'Mensaje del Sistema',
                    msg: 'Ha ocurrido un error en el Sistema. Por favor, vuelva a intentar realizar la operaci\xF3n, de continuar el problema consulte al <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                    buttons: Ext.MessageBox.OK,
                    icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                });
            }
        });
    },

    configExportPDF: function(item) {

        let configWindow = Ext.create('PHNet.view.tracking.ExportPDFWindow');
        configWindow.show();
        Ext.getCmp('export-pdf-title').focus();
    },

    exportPDF: function(button) {

        let win = button.up('window'),
            form = win.down('form'),
            values = form.getValues();

        if (form.isValid()) {

            win.close();

            let formpdf = Ext.create('Ext.form.Panel', {
                items: [{
                        xtype: 'hiddenfield',
                        name: 'title',
                        value: values.title
                    },
                    {
                        xtype: 'hiddenfield',
                        name: 'comment',
                        value: values.comment
                    }
                ]
            });

            formpdf.getForm().doAction('standardsubmit', {
                url: '/phnet.compras/public/api/tracking/export/pdf',
                standardSubmit: true,
                scope: this,
                method: 'GET',
                waitTitle: '&nbsp;<i class="fas fa-cog fa-spin text-white"></i>&nbsp;Creando Informe PDF...',
                waitMsg: '<i class="fas fa-file-pdf icon-red icon-pdf-msg"></i>Por favor, espere mientras se genera el documento.&nbsp;&nbsp;',
                success: function(form, action) {
                    formpdf.destroy(); //or destroy();
                }
            });
            Ext.defer(function() {
                Ext.MessageBox.hide();
            }, 15000);
        }
    },

    configExportExcel: function(item) {

        let configWindow = Ext.create('PHNet.view.tracking.ExportExcelWindow');
        configWindow.show();
        Ext.getCmp('export-excel-type').setValue(item.getItemId());
        Ext.getCmp('export-excel-title').focus();
    },

    exportExcel: function(button) {

        let win = button.up('window'),
            form = win.down('form'),
            values = form.getValues();

        if (form.isValid()) {

            win.close();

            let formpdf = Ext.create('Ext.form.Panel', {
                items: [{
                    xtype: 'hiddenfield',
                    name: 'title',
                    value: values.title
                }]
            });

            formpdf.getForm().doAction('standardsubmit', {
                url: '/phnet.compras/public/api/tracking/export/xlsx',
                standardSubmit: true,
                scope: this,
                method: 'GET',
                waitTitle: '&nbsp;<i class="fas fa-cog fa-spin text-white"></i>&nbsp;Creando Libro Excel...',
                waitMsg: '<i class="fas fa-file-excel icon-green icon-pdf-msg"></i>Por favor, espere mientras se genera el documento.&nbsp;&nbsp;',
                success: function(form, action) {
                    formpdf.destroy(); //or destroy();
                }
            });
            Ext.defer(function() {
                Ext.MessageBox.hide();
            }, 5000);
        }
    },

    handleCommentRequest: function(reqid, reqcode) {

        let commentForm = Ext.create('PHNet.view.shopping.RequestCommentWindow');

        commentForm.setTitle('Agregar Comentario a la Solicitud ' + reqcode);
        Ext.getCmp('request-comment-id').setValue(reqid);
        Ext.getCmp('request-comment-user').setValue(localStorage.getItem('phcp_ui'));

        commentForm.show();
        Ext.getCmp('request-comment').focus();
    },

    commentRequest: function(button) {

        let cthis = this,
            grid = cthis.getRequestsgrid(),
            win = button.up('window'),
            form = win.down('form'),
            values = form.getValues();

        if (form.isValid()) {

            button.setText('Procesando...');
            button.setDisabled(true);
            Ext.getCmp('rcommentform-cancelbutton').setDisabled(true);

            form.getForm().submit({
                method: 'POST',
                url: '/phnet.compras/public/api/shopping/request/comment',
                success: function(result) {

                    button.setText('<i class="fas fa-check"></i>&nbsp;Aceptar');
                    button.setDisabled(false);
                    Ext.getCmp('rcommentform-cancelbutton').setDisabled(false);
                    win.close();

                    Ext.example.msgScs('El Comentario se ha Creado Satisfactoriamente.');
                },
                failure: function() {
                    Ext.MessageBox.show({
                        title: 'Mensaje del Sistema',
                        msg: 'Ha ocurrido un error en el Sistema. Por favor, vuelva a intentar realizar la operacion, de continuar el problema consulte al <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                        buttons: Ext.MessageBox.OK,
                        icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                    });
                }
            });
        }
    },

    handleShowCommentsRequest: function(reqid, reqcode) {

        let commentWindow = Ext.create('PHNet.view.shopping.RequestCommentsWindow'),
            commentsGrid = Ext.getCmp('requestcommentsgrid');

        commentWindow.setTitle('Comentarios Realizados a la Solicitud ' + reqcode);

        // Load Store
        let proxy = commentsGrid.getStore().getProxy();
        Ext.apply(proxy.api, {
            read: '/phnet.compras/public/api/shopping/request/comments/' + reqid
        });
        commentsGrid.getStore().load();

        commentWindow.show();
    },

    handleUbiDate: function(reqid, ubidate) {

        let window = Ext.getCmp(localStorage.getItem('phcp_win_id')),
            grid = window.down('treepanel'),
            record = grid.getSelectionModel().getSelection()[0];

        Ext.Ajax.request({
            url: '/phnet.compras/public/api/tracking/request/ubidate',
            method: 'POST',
            params: {
                id_request: reqid,
                id_user: localStorage.getItem('phcp_ui'),
                newdate: ubidate
            },
            success: function(result, request) {
                let jsonData = Ext.JSON.decode(result.responseText);
                if (jsonData.failure) {
                    Ext.MessageBox.show({
                        title: 'Mensaje del Sistema',
                        msg: 'Ha ocurrido un error al actualizar la fecha de entrega a la UBI. Presione la tecla F5 de su teclado para que todo inicie nuevamente. Si el problema persiste póngase en contacto con el <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                        buttons: Ext.MessageBox.OK,
                        icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                    });
                } else {
                    Ext.example.msgScs('La fecha de entrega a la UBI se ha Actualizado.');
                    record.set('ubidate', jsonData.ubidate);
                }
            },
            failure: function() {
                Ext.MessageBox.show({
                    title: 'Mensaje del Sistema',
                    msg: 'Ha ocurrido un error en la operaci\xF3n. Presione la tecla F5 de su teclado para que todo inicie nuevamente. Si el problema persiste póngase en contacto con el <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                    buttons: Ext.MessageBox.OK,
                    icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                });
            }
        });
    },

    handleCancelRequest: function(reqid, reqcode) {

        let commentForm = Ext.create('PHNet.view.tracking.RequestCancelWindow');

        commentForm.setTitle('Cancelar Solicitud de Compra ' + reqcode);
        Ext.getCmp('request-cancel-id').setValue(reqid);
        Ext.getCmp('request-cancel-user').setValue(localStorage.getItem('phcp_ui'));

        commentForm.show();
        Ext.getCmp('request-cancel-comment').focus();
    },

    cancelRequest: function(button) {

        let win = Ext.getCmp(localStorage.getItem('phcp_win_id')),
            grid = win.down('treepanel'),
            winform = Ext.getCmp('requestcancelwindow'),
            form = winform.down('form'),
            values = form.getValues();

        if (form.isValid()) {

            button.setText('Procesando...');
            button.setDisabled(true);
            Ext.getCmp('rcancelform-cancelbutton').setDisabled(true);

            form.getForm().submit({
                method: 'POST',
                url: '/phnet.compras/public/api/shopping/request/cancel',
                success: function(result) {

                    button.setText('<i class="fas fa-check"></i>&nbsp;Aceptar');
                    button.setDisabled(false);
                    Ext.getCmp('rcancelform-cancelbutton').setDisabled(false);
                    winform.close();
                    grid.getStore().load();
                    Ext.example.msgScs('La Solicitud ha sido Cancelada Satisfactoriamente.');
                },
                failure: function() {
                    Ext.MessageBox.show({
                        title: 'Mensaje del Sistema',
                        msg: 'Ha ocurrido un error en el Sistema. Por favor, vuelva a intentar realizar la operacion, de continuar el problema consulte al <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                        buttons: Ext.MessageBox.OK,
                        icon: 'fas fa-exclamation-triangle fa-2x dlg-error'
                    });
                }
            });
        }
    },

    handleActiveRequest: function(reqid) {

        let win = Ext.getCmp(localStorage.getItem('phcp_win_id')),
            grid = win.down('treepanel');

        Ext.Ajax.request({
            url: '/phnet.compras/public/api/shopping/request/active',
            method: 'POST',
            params: {
                id_request: reqid,
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
                    grid.getStore().load({
                        callback: function(records, operation, success) {
                            grid.getSelectionModel().deselect(records, true);
                            $('.x-grid-row').removeClass('x-grid-row-selected');
                            $('.x-grid-row').removeClass('x-grid-row-focused');
                            $('.x-grid-row').removeClass('x-grid-row-over');
                        }
                    });
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
        });
    }

});