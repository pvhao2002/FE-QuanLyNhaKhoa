import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userInfo: any;
  avatar = 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg';
  ngaySinh: any;
  isSave: boolean = false;
  showPassword: boolean = false;
  originalUserInfo: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem("user") || '{}');
    this.ngaySinh = new Date(this.userInfo.ngaySinh).toLocaleDateString();
    this.originalUserInfo = {...this.userInfo};
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  save() {
    if (!this.userInfo.hoTen || !this.userInfo.diaChi || !this.userInfo.matKhau) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    this.userInfo.ngaySinh = formatDate(this.ngaySinh, 'yyyy-MM-dd', 'en-US');
    this.http.patch('http://localhost:8080/BE-QLNhaKhoa-1.0-SNAPSHOT/api/khach-hang/cap-nhat', this.userInfo)
      .subscribe((res: any) => {
        alert('Cập nhật thông tin thành công');
        this.isSave = false;
        localStorage.setItem("user", JSON.stringify(this.userInfo));
      }, error => {
        alert('Cập nhật thông tin thất bại');
      });
  }

  edit() {
    this.isSave = !this.isSave;
  }

  cancel() {
    this.userInfo = {...this.originalUserInfo};
    // this.ngaySinh =  new Date(this.userInfo.ngaySinh).toLocaleDateString();
    this.isSave = false;
  }
}
