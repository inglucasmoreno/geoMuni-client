import { Component, OnInit, ɵɵtrustConstantResourceUrl } from '@angular/core';
import Swal from 'sweetalert2';
import * as L from 'leaflet';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { TiposService } from '../../services/tipos.service';
import { EventosService } from '../../services/eventos.service';
import { Evento } from 'src/app/models/evento.model';
import * as moment from 'moment';
import { SubtiposService } from 'src/app/services/subtipos.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-geolocalizar',
  templateUrl: './geolocalizar.component.html',
  styles: [
  ]
})
export class GeolocalizarComponent implements OnInit {

  public loading = false;
  public map;
  public usuarioLogin: Usuario;
  public tipos = {};
  public tipos_arr = [];
  public subtipos = {};
  public imagenSubir: File;

  constructor(private auhtService: AuthService,
              private tiposServices: TiposService,
              private eventoService: EventosService,
              private subtipoService: SubtiposService,
              private fileUploadService: FileUploadService) { }

  ngOnInit(): void {
    this.usuarioLogin = this.auhtService.usuario;
    this.listarTipos();
    this.crearMapa();
    this.actualizarMapa();
  }

  listarTipos(): void {
    this.tiposServices.listarTipos(true).subscribe( ({ tipos }) => {
      this.tipos_arr = tipos;
      tipos.map( tipo => this.tipos[tipo._id] = tipo.descripcion )
    });
  }

  crearMapa(): void {

    // Coordenadas iniciales y zoom del mapa
    const centerLat = -33.30212579145777;
    const centerLng = -66.33692121054584;
    const zoomLevel = 14;

    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 14,
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    this.map = L.map('map', {
      center: [centerLat, centerLng],
      zoom: zoomLevel
    })
  
    mainLayer.addTo(this.map);

    // Accion: Click sobre el mapa
    this.map.on('click', async (e) => { 
      if(this.usuarioLogin.role === 'ADMIN_ROLE'){  // Usuario administrador
        if(this.tipos_arr.length != 0) {

          const { value: tipo } = await Swal.fire({
            title: 'Tipo de evento',
            input: 'select',
            inputOptions: this.tipos,
            showCancelButton: true,
            confirmButtonText: 'Seleccionar',
            cancelButtonText: 'Cancelar'
          });
  
          if(tipo){
            // Se listan los subtipos correspondientes a ese tipo
            this.subtipoService.listarSubtipos(tipo, true).subscribe( async ({subtipos}) => {
              this.subtipos = {};
              // Se verifica que los tipos no esten vacios
              if(subtipos.length != 0){
                subtipos.map(subtipo => {this.subtipos[subtipo._id] = subtipo.descripcion})  
                const { value: subtipo } = await Swal.fire({
                  title: 'Subtipo de evento',
                  input: 'select',
                  inputOptions: this.subtipos,
                  showCancelButton: true,
                  confirmButtonText: 'Seleccionar',
                  cancelButtonText: 'Cancelar'
                });
                
                // Se verifica si se selecciona un subtipo
                if(subtipo){
                  
                  const { value: descripcion } = await Swal.fire({
                    title: 'Descripción',
                    input: 'text',
                    inputPlaceholder: 'Descripción del evento',
                    showCancelButton: true,
                    confirmButtonText: 'Entendido',
                    cancelButtonText: 'Cancelar'
                  })
                  
                  // Se verifica si hay descripcion
                  if(descripcion){

                    const { value: file } = await Swal.fire({
                      title: 'Seleccionar imagen',
                      input: 'file',
                      inputAttributes: {
                        'accept': 'image/*',
                        'aria-label': 'Upload your profile picture'
                      },
                      confirmButtonText: 'Subir',
                      showCancelButton: true,
                      cancelButtonText: 'Cancelar'
                    })
                    
                    // Se verifica si hay una imagen cargada
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (e) => { this.imagenSubir = file; }
                      
                      // Creando evento         
                      const dataEvento: Evento = {
                        descripcion,
                        tipo: tipo,
                        subtipo: subtipo,
                        lat: e.latlng.lat.toString(),
                        lng: e.latlng.lng.toString(),
                      }
                      
                      // Crear evento y subir foto
                      this.eventoService.nuevoEvento(dataEvento).subscribe( ({evento}) => {         
                        const subida = this.fileUploadService.actualizarFoto(file, 'eventos', evento._id)
                          .then( (resp: any) => {
                            if(resp.ok){
                              this.actualizarMapa();                  
                              Swal.fire({
                                icon: 'success',
                                title: 'Completado',
                                text: 'Evento creado correctamente',
                                confirmButtonText: 'Entendido'
                              });
                            }else{
                              this.eventoService.eliminarEvento(evento._id).subscribe(()=>{
                                Swal.fire({
                                  icon: 'error',
                                  title: 'Evento no creado',
                                  text: resp.error,
                                  confirmButtonText: 'Entendido'
                                });
                              })
                            }
                          }).catch(err => {
                            console.log(err);
                            Swal.fire({
                              icon: 'error',
                              title: 'Error',
                              text: 'Error de servidor'
                            });
                          }); 
                        
                      });
                    }else{ // No hay imagen - No hacer nada
                      Swal.fire({
                        icon: 'info',
                        title: 'Evento no creado',
                        text: 'La imagen es obligatoria',
                        confirmButtonText: 'Entendido'
                      });
                    } 
                  }else{ // No hay descripcion - No hacer nada
                    Swal.fire({
                      icon: 'info',
                      title: 'Evento no creado',
                      text: 'La descripción es obligatoria',
                      confirmButtonText: 'Entendido'
                    });
                  }
                } // No hay subtipo - No hacer nada
              } // No hay tipo - No hacer nada          
            });            
          }         
        }else{ // No hay tipos cargados en el sistema
          Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Debes agregar al menos un tipo',
            confirmButtonText: 'Entendido'
          })
        }
      }
    });
  }  

  actualizarMapa(): void {
    this.loading = true;
   
    // Icono personalizado
    let alumbradoIcon = L.icon({
      iconUrl: 'assets/alumbrado.png',
      iconSize:     [45, 45], // size of the icon
      iconAnchor:   [30, 38], // point of the icon which will correspond to marker's location
      popupAnchor:  [-10, -50] // point from which the popup should open relative to the iconAnchor
    })

    let bacheoIcon = L.icon({
      iconUrl: 'assets/bacheo.png',
      iconSize:     [45, 45], // size of the icon
      iconAnchor:   [30, 38], // point of the icon which will correspond to marker's location
      popupAnchor:  [-10, -50] // point from which the popup should open relative to the iconAnchor
    })

    let carteleriaIcon = L.icon({
      iconUrl: 'assets/carteleria.png',
      iconSize:     [45, 45], // size of the icon
      iconAnchor:   [30, 38], // point of the icon which will correspond to marker's location
      popupAnchor:  [-10, -50] // point from which the popup should open relative to the iconAnchor
    })

    let espaciosVerdesIcon = L.icon({
      iconUrl: 'assets/espacios_verdes.png',
      iconSize:     [45, 45], // size of the icon
      iconAnchor:   [30, 38], // point of the icon which will correspond to marker's location
      popupAnchor:  [-10, -50] // point from which the popup should open relative to the iconAnchor
    })

    let malaSenalizacionIcon = L.icon({
      iconUrl: 'assets/mala_senalizacion.png',
      iconSize:     [45, 45], // size of the icon
      iconAnchor:   [30, 38], // point of the icon which will correspond to marker's location
      popupAnchor:  [-10, -50] // point from which the popup should open relative to the iconAnchor
    })

    let obrasPrivadaIcon = L.icon({
      iconUrl: 'assets/obras_privadas.png',
      iconSize:     [45, 45], // size of the icon
      iconAnchor:   [30, 38], // point of the icon which will correspond to marker's location
      popupAnchor:  [-10, -50] // point from which the popup should open relative to the iconAnchor
    })

    let plazasPaseosIcon = L.icon({
      iconUrl: 'assets/plazas_paseos.png',
      iconSize:     [45, 45], // size of the icon
      iconAnchor:   [30, 38], // point of the icon which will correspond to marker's location
      popupAnchor:  [-10, -50] // point from which the popup should open relative to the iconAnchor
    })

    let redesIcon = L.icon({
      iconUrl: 'assets/redes.png',
      iconSize:     [45, 45], // size of the icon
      iconAnchor:   [30, 38], // point of the icon which will correspond to marker's location
      popupAnchor:  [-10, -50] // point from which the popup should open relative to the iconAnchor
    })

    let reparacionIcon = L.icon({
      iconUrl: 'assets/reparacion.png',
      iconSize:     [45, 45], // size of the icon
      iconAnchor:   [30, 38], // point of the icon which will correspond to marker's location
      popupAnchor:  [-10, -50] // point from which the popup should open relative to the iconAnchor
    })

    let otrosIcon = L.icon({
      iconUrl: 'assets/icono.png',
      iconSize:     [45, 45], // size of the icon
      iconAnchor:   [30, 38], // point of the icon which will correspond to marker's location
      popupAnchor:  [-10, -50] // point from which the popup should open relative to the iconAnchor
    })
    
    this.eventoService.listarEventos(true).subscribe( ({eventos}) => {
      eventos.forEach( (evento: Evento) => {
        
        let icon;

        if(evento.tipo._id== '6059ee256b561d230049dcf5'){         // Alumbrado publico
          icon = alumbradoIcon;
        }else if(evento.tipo._id == '6059ee2c6b561d230049dcf7'){  // Bacheo
          icon = bacheoIcon;
        }else if(evento.tipo._id == '6059ee386b561d230049dcf9'){  // Carteleria
          icon = carteleriaIcon;
        }else if(evento.tipo._id == '6059ee846b561d230049dcfb'){  // Espacios verdes
          icon = espaciosVerdesIcon;
        }else if(evento.tipo._id == '6059ee996b561d230049dcfd'){  // Mala señalizacion
          icon = malaSenalizacionIcon;
        }else if(evento.tipo._id == '6059eea26b561d230049dcff'){  // Obras privadas
          icon = obrasPrivadaIcon;
        }else if(evento.tipo._id == '6059eeb26b561d230049dd01'){  // Plaza paseos
          icon = plazasPaseosIcon;
        }else if(evento.tipo._id == '6059eeb86b561d230049dd03'){  // Redes
          icon = redesIcon;
        }else if(evento.tipo._id == '6059eebc6b561d230049dd05'){  // Reparacion
          icon = reparacionIcon;
        }else{
          icon = otrosIcon;
        }

        // Circulo
        let circulo = L.circle([Number(evento.lat), Number(evento.lng)], {
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.5,
          radius: 15
        });
        
        // Marcador
        const marcador = L.marker([Number(evento.lat), Number(evento.lng)],{icon}).bindPopup(`
          <div class="rounded p-3">  
                    
            <div class="broder shadow rounded mt-2">
              <h1 class="bg-blue-500 text-white font-semibold p-1 rounded-t text-center"> Tipo de evento </h1> 
              <div class="text-center font-semibold p-1 text-gray-700">
                <span> ${evento.tipo['descripcion']} </span> 
              </div>
            </div>

            <div class="broder shadow rounded mt-2">
              <h1 class="bg-blue-500 text-white font-semibold p-1 rounded-t text-center"> Subtipo de evento </h1> 
              <div class="text-center font-semibold p-1 text-gray-700">
                <span> ${evento.subtipo['descripcion']} </span> 
              </div>
            </div>
                        
            <div class="broder shadow rounded mt-2">
              <h1 class="bg-blue-500 text-white font-semibold p-1 rounded-t text-center"> Fecha de creación </h1> 
              <div class="text-center font-semibold p-1 text-gray-700">
                <span> ${moment(evento.createdAt).format('DD-MM-YYYY')} </span> 
              </div>
            </div>

            <div class="mt-2 border shadow rounded text-center">
              <h2 class="font-semibold bg-blue-500 rounded-t text-white py-1 px-2"> Descripción del evento </h2> 
              <div class="p-2 rounded">
                <span> ${evento.descripcion ? evento.descripcion : 'Sin descripción'} </span>  
              </div>
            </div>
            
            <button 
              onclick="location.href='dashboard/eventos/ver/${evento._id}'"  
              class="p-2 shadow bg-gray-600 text-white mt-2 w-full rounded font-semibold"> 
                Ingresar al evento 
              </button>
          </div>
        `);    
        
        marcador.addTo(this.map);
        // circulo.addTo(this.map);
        
      }); 
      this.loading = false;
    });
  }  
  


}
