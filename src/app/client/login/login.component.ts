import {Component, OnInit, AfterViewInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";

declare let $: any; // Import jQuery

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  formModel: any = {
    soDienThoai: '',
    matKhau: '',
    hoTen: '',
    ngaySinh: '',
    diaChi: ''
  }
  loginModel: any = {
    soDienThoai: '',
    matKhau: ''
  }

  message: any = '';

  constructor(private http: HttpClient) {
  }

  isValidPhoneNumber(phoneNumber: any): boolean {
    const regexPhoneNumber = /(0[3|5|7|8|9])+([0-9]{8})\b/g;
    return phoneNumber.match(regexPhoneNumber);
  }

  ngOnInit(): void {
  }

  isValidRegisterModel(): boolean {
    return this.formModel.soDienThoai
      && this.formModel.matKhau
      && this.formModel.hoTen
      && this.formModel.ngaySinh
      && this.formModel.diaChi;
  }

  isValidLoginModel(): boolean {
    return this.loginModel.soDienThoai
      && this.loginModel.matKhau;
  }

  register(): void {
    if (!this.isValidRegisterModel()) {
      this.message = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }
    if (!this.isValidPhoneNumber(this.formModel.soDienThoai)) {
      this.message = 'Số điện thoại không hợp lệ';
      return;
    }
    this.http.post('http://localhost:8080/BE-QLNhaKhoa-1.0-SNAPSHOT/api/khach-hang/dang-ky', this.formModel)
      .subscribe((res: any) => {
        if (res?.message != 'Success') {
          this.message = 'Đăng ký thất bại';
        } else {
          this.message = 'Đăng ký thành công';
          this.formModel = {
            soDienThoai: '',
            matKhau: '',
            hoTen: '',
            ngaySinh: '',
            diaChi: ''
          }
          $('.tab a:contains("Đăng nhập")').trigger('click');
        }
      });
  }

  ngAfterViewInit(): void {
    // Sử dụng ngAfterViewInit để đảm bảo các phần tử đã được tạo
    $('.form').find('input, textarea').on('keyup blur focus', (e: Event) => {
      const $this = $(e.target),
        label = $this.prev('label');

      if (e.type === 'keyup') {
        if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
      } else if (e.type === 'blur') {
        if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.removeClass('highlight');
        }
      } else if (e.type === 'focus') {
        if ($this.val() === '') {
          label.removeClass('highlight');
        } else if ($this.val() !== '') {
          label.addClass('highlight');
        }
      }
    });

    $('.tab a').on('click', function (e: Event) {
      e.preventDefault();

      // Đảm bảo chỉ thực hiện khi tab chưa có class "active"
      if (!$(e.target).parent().hasClass('active')) {
        $(e.target).parent().addClass('active');
        $(e.target).parent().siblings().removeClass('active');

        const target = $(e.target).attr('href');

        $('.tab-content > div').hide();
        $(target).fadeIn(600);
      }
    });
  }

  login(): void {
    if(!this.isValidLoginModel()) {
      this.message = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }
    if(!this.isValidPhoneNumber(this.loginModel.soDienThoai)) {
      this.message = 'Số điện thoại không hợp lệ';
      return;
    }
    this.http.post('http://localhost:8080/BE-QLNhaKhoa-1.0-SNAPSHOT/api/khach-hang/dang-nhap', this.loginModel)
      .subscribe((res: any) => {
        if (res?.message != 'Success' && !res?.data) {
          this.message = 'Tên đăng nhập hoặc mật khẩu không đúng';
        } else {
          localStorage.setItem('user', JSON.stringify(res?.data));
          window.location.href = '/';
        }
      });
  }
}

export interface account {
  idKhachHang: any;
  hoTen: any;
  ngaySinh: any;
  diaChi: any;
  soDienThoai: any;
  matKhau: any;
}
