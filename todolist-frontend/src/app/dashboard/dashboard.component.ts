import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../shared/data-access/auth-state.service';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TasksService } from './data-access/dashboard.service';
import { CommonModule } from '@angular/common';

//1 Definir interfaz del formulario

interface TaskForm {
  title: FormControl<string>;
  date: FormControl<Date | null>;
  description: FormControl<string>;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export default class DashboardComponent {
  //definimos variable de error

  private _authStateService = inject(AuthStateService);
  //inyectar servicio del componente dashboard

  errorMessage: string | null = null; // Para almacenar el mensaje de error

  successMessage: string | null = null;

  editingTaskId: number | null = null;

  isEditing = false;

  userId!: number;
  tasks: any[] = [];
  currentPage = 1; // Página actual
  pageSize = 4; // Tamaño de página
  totalPages = 1; // Total de páginas

  private _router = inject(Router);

  private _formBuilder = inject(FormBuilder);

  constructor(
    private tasksService: TasksService,
    private authService: AuthStateService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getUserId();
    console.log('Usuario logueado ID:', this.userId); // <-- Agrega esto
    this.findAllTaskByUserId();
  }

  //obtener valores del  formulario
  form = this._formBuilder.group<TaskForm>({
    title: this._formBuilder.nonNullable.control('', Validators.required),
    date: this._formBuilder.nonNullable.control<Date | null>(
      null,
      Validators.required
    ),
    description: this._formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(100), // 🔹 Limita la descripción a 100 caracteres
    ]),
  });

  findAllTaskByUserId() {
    this.tasksService
      .findAllTaskByUserId(this.userId, this.currentPage, this.pageSize)
      .subscribe((response: any) => {
        this.tasks = response.data; // 🔹 Actualizar tareas con la nueva página
        this.totalPages = response.totalPages; // 🔹 Actualizar total de páginas
        console.log(
          `📌 Mostrando página ${this.currentPage} de ${this.totalPages}`
        );
      });
  }

  //metodo agregar tarea

  addTask() {
    if (this.form.invalid) {
      this.errorMessage = '⚠️ Todos los campos son obligatorios.';
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
      return;
    }

    const { title, date, description } = this.form.getRawValue();

    // Validación extra para asegurarse de que la fecha fue ingresada
    if (!date) {
      this.errorMessage = '⚠️ Debes seleccionar una fecha.';
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
      return;
    }

    this.errorMessage = null; // Resetear el mensaje de error antes de llamar al servicio

    this.tasksService.addTask(title, date, description, this.userId).subscribe({
      next: (response) => {
        console.log('✅ Tarea creada:', response);
        this.successMessage = '✅ Tarea creada con éxito.';

        // Vaciar el formulario después de la creación
        this.form.reset();

        // Recargar las tareas
        this.findAllTaskByUserId();

        // Limpiar el mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Error creando tarea:', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage =
            '❌ Ocurrió un error inesperado. Inténtalo de nuevo.';
        }
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }

  deleteTask(taskId: number) {
    if (!confirm('❌ ¿Seguro que deseas eliminar esta tarea?')) return;

    this.tasksService.deleteTask(this.userId, taskId).subscribe({
      next: () => {
        console.log(`🗑️ Tarea con ID ${taskId} eliminada`);
        this.successMessage = '✅ Tarea eliminada con éxito.';

        // Filtrar la tarea eliminada del array sin hacer otra petición
        this.tasks = this.tasks.filter((task) => task.id !== taskId);

        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Error eliminando tarea:', error);
        this.errorMessage = '❌ Ocurrió un error al eliminar la tarea.';
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }

  editTask(task: any) {
    this.isEditing = true;
    this.editingTaskId = task.id;

    
    const formattedDate = task.date
    ? new Date(task.date).toISOString().slice(0, 16) // Obtiene "YYYY-MM-DDTHH:MM"
    : '';

    // Rellenar el formulario con los datos de la tarea seleccionada
    this.form.setValue({
      title: task.title,
      date: new Date(formattedDate), // Assign a Date object
      description: task.description,
    });

    console.log(`✏️ Editando tarea con ID: ${task.id}`);
  }

  updateTask() {
    if (this.form.invalid || this.editingTaskId === null) {
      this.errorMessage = '⚠️ Todos los campos son obligatorios.';
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
      return;
    }



    const { title, date, description } = this.form.getRawValue();

    // Validación extra para asegurarse de que la fecha fue ingresada
    if (!date) {
      this.errorMessage = '⚠️ Debes seleccionar una fecha.';
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
      return;
    }

    this.tasksService
      .updateTask(this.userId, this.editingTaskId, title, date, description)
      .subscribe({
        next: () => {
          console.log(`🔄 Tarea con ID ${this.editingTaskId} actualizada`);
          this.successMessage = '✅ Tarea actualizada con éxito.';

          // Actualizar la lista de tareas sin hacer otra petición al backend
          this.tasks = this.tasks.map((task) =>
            task.id === this.editingTaskId
              ? { ...task, title, date, description }
              : task
          );

          // Resetear formulario
          this.form.reset();
          this.isEditing = false;
          this.editingTaskId = null;

          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (error) => {
          console.error('❌ Error actualizando tarea:', error);
          this.errorMessage = '❌ Ocurrió un error al actualizar la tarea.';
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        },
      });
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.findAllTaskByUserId();
    }
  }

  logout() {
    this._authStateService.singOut(); // Elimina la sesión
    this._router.navigateByUrl('/auth/log-in'); // Redirige al login
  }
}
