import { inject, Injectable } from '@angular/core';
import {
  getDownloadURL,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { ref } from 'firebase/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CloudStorageService {
  private _storage = inject(Storage);

  uploadFile(
    folder: string = 'profiles',
    file: File
  ): Observable<{ progress: number; url: string }> {
    const fileName = Date.now();
    const storageRef = ref(this._storage, folder + '/' + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Observable((observer) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next({ progress, url: '' });
        },
        (error) => {
          observer.error(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          observer.next({ progress: 100, url: downloadURL });
          observer.complete();
        }
      );
    });
  }
}
