import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { UsersService } from 'src/app/services/user.service';
import { HotToastService } from '@ngneat/hot-toast';
import { ProfileUser } from 'src/app/models/user';
import { switchMap, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;
  profileForm = this.fb.group({
    uid: [''],
    firstName: [''],
    lastName: [''],
    displayName: [''],
    phone: [''],
    dateOfBirth: [''],
  });

  constructor(private imageUploadService: ImageUploadService,
    private toast: HotToastService,
    private usersService: UsersService,
    private fb: NonNullableFormBuilder) { }

    ngOnInit(): void {
      this.usersService.currentUserProfile$
        .pipe(untilDestroyed(this), tap(console.log))
        .subscribe((user) => {
          this.profileForm.patchValue({ ...user });
        });
    }

    formatDate(e:any) {
      var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
      this.profileForm.get('dateOfBirth')?.setValue(convertDate, {
        onlyself: true,
      });
    }

    uploadFile(event: any, { uid, displayName }: ProfileUser) {
      this.imageUploadService
        .uploadImage(event.target.files[0], `images/profile/${uid}`)
        .pipe(
          this.toast.observe({
            loading: 'Uploading profile image...',
            success: 'Image uploaded successfully',
            error: ({ message }) => `There was an error in uploading the image: ${message}`,
          }),
          switchMap((photoURL) =>
            this.usersService.updateUser({
              uid: uid,
              photoURL: photoURL,
              displayName: displayName
            })
          )
        )
        .subscribe();
    }

    saveProfile() {
      const { uid, displayName, ...data } = this.profileForm.value;
  
      if (!uid) {
        return;
      }
  
      this.usersService
        .updateUser({ uid, displayName, ...data })
        .pipe(
          this.toast.observe({
            loading: 'Saving profile data...',
            success: 'Profile updated successfully',
            error: ({ message }) => `There was an error in updating the profile: ${message}`,
          })
        )
        .subscribe();
    }
}

