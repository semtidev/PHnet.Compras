// Globals
var user_works = '',
    user_roles = '',
    user_reqadd = 0,
    user_reqdpto = [],
    user_reqwork = '';

Ext.application({
    name: 'PHNet',
    appFolder: 'app',
    appProperty: 'App',
    controllers: ['App', 'Gallery', 'shopping.Requests', 'shopping.Tracking'],
    launch: function() {

        var heightScreen = window.screen.availHeight,
            heightWindow = heightScreen - 280,
            widthScreen = window.screen.availWidth,
            widthWindow = widthScreen - 280;

        // Destroy Filters
        localStorage.removeItem('tracking_filter');
        localStorage.removeItem('phcp_rfilter');

        // Set LocalStorage month & year
        var month = new Date().getMonth() + 1;
        if (month < 10) { month = '0' + month; }
        localStorage.setItem('phcp_m', month);
        localStorage.setItem('phcp_y', new Date().getFullYear());

        // Load Last App Screen        
        if (localStorage.getItem('phcp_win')) {

            $('body').addClass('bg-home');
            Ext.create(localStorage.getItem('phcp_win'), {
                width: widthWindow,
                height: heightWindow
            });
            $('.nav-icons li').removeClass('active');
            if (localStorage.getItem('phcp_win_id') == 'configwindow') {
                $('#lnk-config').addClass('active');
            } else if (localStorage.getItem('phcp_win_id') == 'dashboardwindow') {
                $('#lnk-cmi').addClass('active');
            } else if (localStorage.getItem('phcp_win_id') == 'requestswindow' || localStorage.getItem('phcp_win_id') == 'trackingnatwindow' || localStorage.getItem('phcp_win_id') == 'trackingimpwindow') {
                $('#dropdown-shopping').addClass('focus');
            }
        } else {
            $('body').addClass('bg-home');
            $('#lnk-home').addClass('active');
        }

        // Open Windows

        // APP

        $(document).on('click', '#lnk-home a', function() {

            /*$('body').removeClass('bg-windows');
            $('body').addClass('bg-home');*/

            if (localStorage.getItem('phcp_win_id')) {
                Ext.destroy(Ext.getCmp(localStorage.getItem('phcp_win_id')));
            }
            $('#dropdown-quality').removeClass('focus');
            $('#lnk-home').addClass('active');
            localStorage.removeItem('phcp_win');
            localStorage.removeItem('phcp_win_id');
            return;
        });

        $(document).on('click', '#lnk-config', function() {

            if (localStorage.getItem('phcp_win_id')) {
                Ext.destroy(Ext.getCmp(localStorage.getItem('phcp_win_id')));
            }
            Ext.create('PHNet.view.app.ConfigWindow', {
                width: widthWindow,
                height: heightWindow
            });
            $('.nav-icons li').removeClass('active');
            $('#dropdown-shopping').removeClass('focus');
            $('#lnk-config').addClass('active');
            localStorage.setItem('phcp_win', 'PHNet.view.app.ConfigWindow');
            localStorage.setItem('phcp_win_id', 'configwindow');
            return;
        });

        $(document).on('click', '#lnk-cmi', function() {

            if (localStorage.getItem('phcp_win_id')) {
                Ext.destroy(Ext.getCmp(localStorage.getItem('phcp_win_id')));
            }
            Ext.create('PHNet.view.app.DashboardWindow', {
                width: widthWindow,
                height: heightWindow
            });
            $('.nav-icons li').removeClass('active');
            $('#lnk-cmi').addClass('focus');
            localStorage.setItem('phcp_win', 'PHNet.view.app.DashboardWindow');
            localStorage.setItem('phcp_win_id', 'dashboardwindow');
            return;
        });

        // SHOPPING

        $(document).on('click', '#lnk-shopping-request', function() {

            if (localStorage.getItem('phcp_win_id')) {
                Ext.destroy(Ext.getCmp(localStorage.getItem('phcp_win_id')));
            }
            Ext.create('PHNet.view.shopping.RequestsWindow', {
                width: widthWindow,
                height: heightWindow
            });
            $('.nav-icons li').removeClass('active');
            $('.nav-icons li').removeClass('focus');
            $('#dropdown-shopping').addClass('focus');
            localStorage.setItem('phcp_win', 'PHNet.view.shopping.RequestsWindow');
            localStorage.setItem('phcp_win_id', 'requestswindow');
            return;
        });

        $(document).on('click', '#lnk-shopping-trackingnat', function() {

            if (localStorage.getItem('phcp_win_id')) {
                Ext.destroy(Ext.getCmp(localStorage.getItem('phcp_win_id')));
            }
            Ext.create('PHNet.view.tracking.TrackingNatWindow', {
                width: widthWindow,
                height: heightWindow
            });
            $('.nav-icons li').removeClass('active');
            $('.nav-icons li').removeClass('focus');
            $('#dropdown-shopping').addClass('focus');
            localStorage.setItem('phcp_win', 'PHNet.view.tracking.TrackingNatWindow');
            localStorage.setItem('phcp_win_id', 'trackingnatwindow');
            return;
        });

        $(document).on('click', '#lnk-shopping-trackingimp', function() {

            if (localStorage.getItem('phcp_win_id')) {
                Ext.destroy(Ext.getCmp(localStorage.getItem('phcp_win_id')));
            }
            Ext.create('PHNet.view.tracking.TrackingImpWindow', {
                width: widthWindow,
                height: heightWindow
            });
            $('.nav-icons li').removeClass('active');
            $('.nav-icons li').removeClass('focus');
            $('#dropdown-shopping').addClass('focus');
            localStorage.setItem('phcp_win', 'PHNet.view.tracking.TrackingImpWindow');
            localStorage.setItem('phcp_win_id', 'trackingimpwindow');
            return;
        });

        // USER

        $(document).on('click', '#lnk-replace', function() {

            Ext.create('PHNet.view.app.ReplaceWindow');
            return;
        });

        $(document).on('click', '#lnk-userprofile', function() {
            var profile = Ext.create('PHNet.view.app.ProfileWindow'),
                form = profile.down('form'),
                id_user = localStorage.getItem('phshopping_userid');

            /* USER NOTIFY
            form.getForm().load({
                url: '/phnet.compras/public/api/user/profile',
                method: 'POST',
                params: {
                    id_user: id_user
                },
                success: function(form, action) {
                    localStorage.setItem('profile_metroplan_change', '1');
                },
                failure: function(form, action) {
                    profile.close();
                    Ext.Msg.alert('Carga Fallida', 'La carga de los parametros del Usuario no se ha realizado. Por favor, intentelo de nuevo, de mantenerse el problema contacte con el <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.');
                }
            });*/
            return;
        });

        $(document).on('click', '#lnk-userpassword', function() {
            Ext.create('PHNet.view.app.ProfilePassword');
        });

        // Locked Screen
        if (!localStorage.getItem('phcp_ss')) {
            localStorage.setItem('phcp_ss', 'active')
        } else {
            if (localStorage.getItem('phcp_ss') != 'active') {
                window.location = '/phnet.compras/public/locked';
            }
        }
        if (auth) {
            last_activity = Date.now();
            $("html").mousemove(function(event) {
                last_activity = Date.now();
            });
            var task = {
                run: function() {
                    elapsed = (Date.now() - last_activity) / 1000;
                    if (elapsed > 300) {
                        window.location = '/phnet.compras/public/locked';
                    }
                },
                interval: 300000 //300 second - 5 minutes
            }
            Ext.TaskManager.start(task);
        }

        // Delete Request
        /*$(document).on('click', '.del-request-icon', function() {
            let grid = Ext.getCmp('shopp711tab'),
                id   = $(this).data('id');
            grid.fireEvent('deleteclick', id);
        });*/

        // Upload Temp Photo
        $(document).on('change', '#product-photo', function() {

            let form = $('#load-temp-photo'),
                searchBtn = Ext.get('search-btn'),
                imgPrev = Ext.get('img-photo-prev'),
                nrandom = $('#nrandom'),
                photoprev = $('#loadphoto_prev'),
                myrand = parseInt(Math.random() * 99999999);

            nrandom.val(myrand);
            searchBtn.setHTML('<i class="fas fa-spinner fa-pulse"></i>&nbsp;Cargando...');

            let formData = new FormData(form[0]);

            $.ajax({
                type: 'POST',
                url: '/phnet.compras/public/api/gallery/loadtempphoto',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function(response) {
                    searchBtn.setHTML('Buscar Foto...');
                    imgPrev.setHTML('<img src="/phnet.compras/public/dist/img/temp/medium/' + response.imagename + '">');
                    photoprev.val(response.imagename);
                    Ext.getCmp('gallery-photoform-photo').setValue(response.imagename);
                },
                error: function(xhr) {
                    let res = xhr.responseJSON;
                    if ($.isEmptyObject(res) == false) {
                        console.log(res);
                        searchBtn.setHTML('Buscar Foto...');
                        $.each(res.errors, function(key, value) {
                            Ext.example.msgError('Error en la operaci\xF3n:', key + ': ' + value);
                        });
                    }
                }
            });
        });

        // Deselect Product Photo
        $(document).on('click', '#product-photo-deselect', function() {

            let grid = Ext.getCmp('requestproductsgrid'),
                record = grid.getSelectionModel().getSelection()[0],
                product = record.get('id');

            Ext.get('product-photo-deselect').setHTML('Procesando...');

            $.ajax({
                type: 'DELETE',
                url: '/phnet.compras/public/api/request/product/quitphoto',
                data: { product: product },
                dataType: "html",
                success: function(response) {
                    Ext.get('product-photo-deselect').setHTML('Quitar Foto');

                    let win = Ext.getCmp('gallerywindow'),
                        grid = Ext.getCmp('requestproductsgrid'),
                        photopanel = Ext.getCmp('gallery-photo-panel'),
                        nophotopanel = Ext.create('PHNet.view.gallery.NophotoPanel');

                    grid.getStore().load();
                    win.down('#gallery-right').remove(photopanel);
                    win.down('#gallery-right').add(nophotopanel);
                    Ext.get('nophoto-product').setHTML(record.data.description);

                    Ext.getCmp('gallery-btn-addphoto').setVisible(true).getEl().slideIn('l', {
                        duration: 250
                    });
                    Ext.getCmp('galleryform-btn-store').setVisible(false);
                    Ext.getCmp('gallery-btn-calcel').setVisible(false);
                    Ext.getCmp('galleryform-btn-select').setVisible(false);
                },
                error: function(xhr) {
                    let res = xhr.responseJSON;
                    if ($.isEmptyObject(res) == false) {
                        Ext.get('product-photo-deselect').setHTML('Quitar Foto');
                        $.each(res.errors, function(key, value) {
                            Ext.example.msgError('Error en la operaci\xF3n:', key + ': ' + value);
                        });
                    }
                }
            });
        });

        // Upload Request PDF
        $(document).on('change', '.request-pdf', function() {

            let inputfile = $(this),
                arr_input = inputfile.attr('id').split('-'),
                requestid = arr_input[2],
                form = $('#load-requestpdf-' + requestid),
                searchBtn = Ext.get('search-btn-' + requestid),
                grid = Ext.getCmp('shopp711tab');

            searchBtn.setHTML('<i class="fas fa-sync fa-spin icon-blue"></i>');
            let formData = new FormData(form[0]);

            $.ajax({
                type: 'POST',
                url: '/phnet.compras/public/api/shopping/request/uploadpdf',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function(response) {
                    Ext.example.msgScs('El documento PDF se ha Cargado Satisfactoriamente.');
                    grid.getStore().load();
                },
                error: function(xhr) {
                    let res = xhr.responseJSON;
                    if ($.isEmptyObject(res) == false) {
                        grid.getStore().load();
                        $.each(res.errors, function(key, value) {
                            Ext.example.msgError('Error en la operaci\xF3n:', key + ': ' + value);
                        });
                    }
                }
            });
        });
    },
    listeners: {
        specialkey: function(field, e) {
            // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
            // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
            if (e.getKey() == e.ENTER) {
                alert('L Key');
            }
        }
    }
});