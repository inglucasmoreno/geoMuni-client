import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import * as L from 'leaflet';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { TiposService } from '../../services/tipos.service';
import { EventosService } from '../../services/eventos.service';
import { Evento } from 'src/app/models/evento.model';
import * as moment from 'moment';

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
  
  constructor(private auhtService: AuthService,
              private tiposServices: TiposService,
              private eventoService: EventosService) { }

  ngOnInit(): void {
    this.usuarioLogin = this.auhtService.usuario;
    this.listarTipos();
    this.crearMapa();
    this.actualizarMapa();
  }

  listarTipos(): void {
    this.tiposServices.listarTipos(true).subscribe( ({ tipos }) => {
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
        const { value: tipo } = await Swal.fire({
          title: 'Tipo de evento',
          input: 'select',
          inputOptions: this.tipos,
          showCancelButton: true,
          confirmButtonText: 'Seleccionar',
          cancelButtonText: 'Cancelar'
        });

        if(tipo) {
          const { value: descripcion } = await Swal.fire({
            title: 'Descripción del evento',
            input: 'text',
            inputPlaceholder: 'Descripción',
            showCancelButton: true,
            confirmButtonText: 'Entendido',
            cancelButtonText: 'Cancelar'
          })
          
          if(tipo && descripcion){
         
            // Creando evento         
            const dataEvento: Evento = {
              descripcion,
              tipo: tipo,
              lat: e.latlng.lat.toString(),
              lng: e.latlng.lng.toString(),
            }

            this.eventoService.nuevoEvento(dataEvento).subscribe( () => {
              this.actualizarMapa();
              Swal.fire({
                icon: 'success',
                title: 'Completado',
                text: 'Evento creado correctamente',
                confirmButtonText: 'Entendido'
              });
            });
             
          }
        }
      }
    });

  }  

  actualizarMapa(): void {
    this.loading = true;
    
    // Icono personalizado
    let icon = L.icon({
      iconUrl: 'assets/icono.png',
      iconSize:     [38, 38], // size of the icon
      iconAnchor:   [38, 38], // point of the icon which will correspond to marker's location
      popupAnchor:  [-10, -50] // point from which the popup should open relative to the iconAnchor
    })

    
    this.eventoService.listarEventos(true).subscribe( ({eventos}) => {
      eventos.forEach( (evento: Evento) => {
        
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
        circulo.addTo(this.map);
        
      }); 
      this.loading = false;
    });
  }  
  


}
