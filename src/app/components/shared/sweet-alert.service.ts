import { Injectable } from "@angular/core";

import Swal from "sweetalert2";

type FeedbackType = "inactive" | "message";
type ActionType = "success" | "danger" | "warning";

@Injectable({
  providedIn: "root",
})
export class SweetAlertService {
  load() {
    Swal.fire({
      title: "Cargando información",
      text: "Por favor, espere un momento.",
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
  }

  save() {
    Swal.fire({
      title: "Registrando información",
      text: "Por favor, espere un momento",
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });
  }

  error(error: any) {
    Swal.fire({
      icon: "error",
      title: "¡Ups!, Algo a salido mal",
      text: error,
      footer: "<a>Contacte con el administrador del sistema</a>",
    });
  }

  information(text: string) {
    Swal.fire("Lo sentimos", text, "info");
  }

  informationText(title: string, text: string) {
    Swal.fire({
      title,
      text,
      confirmButtonColor: "#1d6fb7",
      confirmButtonText: "Cerrar",
    });
  }

  confirmationDelete(): Promise<any> {
    return new Promise(function (resolve, reject) {
      Swal.fire({
        title: "¿Está seguro?",
        text: "No podrá recuperar este registro",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d50000",
        cancelButtonColor: "#9e9e9e",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      })
        .then((result) => {
          let response = {
            statusCode: 200,
            message: "Confirmación realizada satisfactoriamente.",
            data: result,
          };

          resolve(response);
        })
        .catch((error) => {
          let response = {
            statusCode: 400,
            message: `Error al confirmar solicitud. ${error}`,
          };

          reject(response);
        });
    });
  }

  async confirmationCustom(title: string, text: string, textConfirmationButton: string, typeConfirmation?: ActionType): Promise<boolean> {
    const resp = await Swal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor:
        typeConfirmation == "danger"
          ? "#BD1622"
          : typeConfirmation == "warning"
            ? "#FFC74A"
            : "#21A35B",
      confirmButtonText: textConfirmationButton,
      cancelButtonText: "Cancelar",
    });

    if (resp.isConfirmed) return true;

    return false;
  }

  async informationCustom(title: string, text: string): Promise<boolean> {
    const res = await Swal.fire({
      title,
      text,
      icon: "info",
      showCancelButton: false,
      confirmButtonColor: "#198754",
      confirmButtonText: "Aceptar",
    });

    if (res.isConfirmed) return true;

    return false;
  }

  async sendFeedback(placeholder: string, type: FeedbackType): Promise<string | null> {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Feedback",
      inputPlaceholder: placeholder,
      inputAttributes: {
        "aria-label": placeholder,
      },
      showCancelButton: true,
      confirmButtonColor: type === "inactive" ? "#BD1622" : "#FFC74A",
      confirmButtonText:
        type === "inactive" ? "Inactivar" : "Enviar recomendación",
      cancelButtonText: "Cancelar",
    });

    if (text?.trim()) {
      return text.trim();
    }

    return null;
  }

  async sendComment(user: string): Promise<string | null> {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: `Responder a ${user}`,
      inputPlaceholder:
        "Responde a tu potencial cliente y aumenta tus oportunidades de concretar una venta",
      inputAttributes: {
        "aria-label": user,
      },
      showCancelButton: true,
      confirmButtonColor: "#2D2E82",
      confirmButtonText: "Responder comentario",
      cancelButtonText: "Cancelar",
    });

    if (text?.trim()) {
      return text.trim();
    }

    return null;
  }

  /* Este es el mas reciente */
  async delete(): Promise<boolean> {
    const res = await Swal.fire({
      title: "¿Está seguro?",
      text: "No podrá recuperar este registro",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#BD1622",
      cancelButtonColor: "#999999",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (res.isConfirmed) return true;

    return false;
  }

  close() {
    Swal.close();
  }
}
