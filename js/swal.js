import Swal from 'sweetalert2';
export async function handleEdit(inputValue, id, fn) {
  return Swal.fire({
    title: "編輯你的代辦事項",
    input: "text",
    inputValue: inputValue,
    inputAttributes: {
      autocapitalize: "off"
    },
    showCancelButton: true,
    confirmButtonText: "確認修改",
    cancelButtonText: "取消",
    showLoaderOnConfirm: true,
    preConfirm: () => {
      const newValue = Swal.getInput().value; // 獲取用戶輸入的新值
      return fn(id, newValue)
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (!result.isConfirmed) {
      return
    }
    if (result.value.status === 404) {
      Swal.fire({
        title: '修改失敗',
        icon: "error"
      });
      return;
    }
    if (result.value.status === 200) {
      Swal.fire({
        title: '修改成功',
        icon: "success"
      });
      return result.value.data
    }
  });
}

//刪除提示
export async function handleDelete(id, fn) {
  return Swal.fire({
    title: "刪除事項",
    text: "你確定要刪除此項目嗎?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確定",
    cancelButtonText: "取消",
    preConfirm: () => {
      return fn(id)
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (!result.isConfirmed) {
      return
    }
    console.log(result)
    if (result.value.status === 200) {
      Swal.fire({
        title: `${result.value.data.message}`,
        icon: "success"
      });
      return result.value.data
    }
    // if (result.isConfirmed) {
    //   Swal.fire({
    //     title: "Deleted!",
    //     text: "Your file has been deleted.",
    //     icon: "success"
    //   });
    // }
  });
}

export function loading(statusText) {
  Swal.fire({
    title: statusText,
    text: "請稍候...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
}

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 1000,
});
export function toast(iconText, titleText) {
  Toast.fire({
    icon: iconText,
    title: titleText,

  });

}

export function statusAlert(statusTitle, statusIcon) {
  Swal.fire({
    title: `${statusTitle}`,
    icon: `${statusIcon}`,
    timer: 750,
    showConfirmButton: false,
  });
}

export function errorAlert(statusTitle, statusIcon) {
  Swal.fire({
    title: `${statusTitle}`,
    icon: `${statusIcon}`,
    showConfirmButton: true,
    confirmButtonText: "確定"
  });
}