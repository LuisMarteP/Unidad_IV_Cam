import { Component } from '@angular/core';
//Importaciones para usar la camara
import { Plugins } from '@capacitor/core';
import { CameraResultType, CameraSource } from '@capacitor/camera';
import { PhotoModalPage } from '../photo-modal/photo-modal.page';

import { ModalController } from '@ionic/angular';

const { Camera } = Plugins;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
//Variables
  photos: string[] = [];
  selectedPhotos: string[] = []; //arreglo para las fotos seleccionadas
  isSelecting: boolean = false; //Para controlar si se está en modo selección

  constructor(private modalController: ModalController) { }

//Tomar Foto
  async takePicture() {
    try {
      const image = await Camera['getPhoto']({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100
      });

      const imageUrl = image.webPath;
      this.photos.push(imageUrl); // Agregar la URL al arreglo de fotos
      
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }

  toggleSelectMode() {
    this.isSelecting = !this.isSelecting;
    if (!this.isSelecting) {
      this.selectedPhotos = []; // Limpiar fotos seleccionadas al salir del modo selección
    }
  }
//Selecionar varias fotos
  selectPhoto(photo: string) {
    if (this.isSelecting) {
      const index = this.selectedPhotos.indexOf(photo);
      if (index === -1) {
        this.selectedPhotos.push(photo);
      } else {
        this.selectedPhotos.splice(index, 1);
      }
    } else {
      this.enlargePhoto(photo); // Llama a la función para agrandar la imagen cuando no estás en modo de selección
    }
  }
//Borrar Fotos
  deleteSelectedPhotos() {
    this.photos = this.photos.filter(photo => !this.selectedPhotos.includes(photo));
    this.selectedPhotos = []; // Limpiar fotos seleccionadas después de eliminar
    this.isSelecting = false; // Salir del modo selección después de eliminar
  }
//Agrandar la Foto
  async enlargePhoto(photoUrl: string) {
    const modal = await this.modalController.create({
      component: PhotoModalPage,
      componentProps: {
        photoUrl: photoUrl
      }
    });
    return await modal.present();
  }

}