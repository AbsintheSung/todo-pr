import Swal from 'sweetalert2';
export async function handleEdit(inputValue,id,fn){
    return Swal.fire({
        title: "編輯你的代辦事項",
        input: "text",
        inputValue:inputValue,
        inputAttributes: {
          autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "確認修改",
        cancelButtonText: "取消", 
        showLoaderOnConfirm: true,
        preConfirm:  ()=>{
            const newValue = Swal.getInput().value; // 獲取用戶輸入的新值
            return fn(id, newValue)
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if(!result.isConfirmed){
            return
        }
        if(result.value.status===404){
            Swal.fire({
                title: '修改失敗',
                icon: "error"
            });
            return;
        }
        if (result.value.status===200) {
          Swal.fire({
            title: '修改成功',
            icon: "success"
          });
          return result.value.data
        }
      });
}
