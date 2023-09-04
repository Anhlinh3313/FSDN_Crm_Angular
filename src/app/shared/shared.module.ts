import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleplaceDirective } from './directives/google-place.directive';
import { AgmCoreModule } from '@agm/core';
import { ImagePreview } from './directives/image-preview.directive';
import { environment } from '../../environments/environment.prod';

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      //flashship
      // apiKey:"AIzaSyDvWH7xuK-S8BhTKBYd61E2RsCvyyxHkSs",
      //vietstart
      //apiKey: "AIzaSyCVfrBxAaDm3MWP69i4tfAjbvWBRlSh0gY",
      //tasetco
      apiKey: environment.gMapKey,
      libraries: ["places"],
      language: 'vi',
      region: 'VN'
    }),
    CommonModule,
    FormsModule,
  ],
  declarations: [
    GoogleplaceDirective,
    ImagePreview,
  ],
  exports: [
    GoogleplaceDirective,
    ImagePreview
  ],
  providers: []
})
export class SharedModule { }
