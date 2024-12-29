import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Task, TaskCopy, TimeSpentOnDayCopy } from '../task.model';
import { TaskService } from '../task.service';
import { getTodayStr } from '../util/get-today-str';
import { createTaskCopy } from '../util/create-task-copy';
import { DialogAddTimeEstimateForOtherDayComponent } from '../dialog-add-time-estimate-for-other-day/dialog-add-time-estimate-for-other-day.component';
import { getWorklogStr } from '../../../util/get-work-log-str';
import { T } from '../../../t.const';

@Component({
  selector: 'dialog-time-estimate',
  templateUrl: './dialog-time-estimate.component.html',
  styleUrls: ['./dialog-time-estimate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DialogTimeEstimateComponent implements AfterViewInit {
  private _matDialogRef = inject<MatDialogRef<DialogTimeEstimateComponent>>(MatDialogRef);
  private _matDialog = inject(MatDialog);
  private _taskService = inject(TaskService);
  private _cd = inject(ChangeDetectorRef);
  private _el = inject(ElementRef);
  data = inject(MAT_DIALOG_DATA);

  T: typeof T = T;
  todayStr: string;
  task: Task;
  taskCopy: TaskCopy;
  timeSpentOnDayCopy: TimeSpentOnDayCopy;

  constructor() {
    const _taskService = this._taskService;

    this.task = this.data.task;
    this.todayStr = getTodayStr();
    this._taskService = _taskService;
    this.taskCopy = createTaskCopy(this.task);
    this.timeSpentOnDayCopy = this.taskCopy.timeSpentOnDay || {};
  }

  ngAfterViewInit(): void {
    if (this.data.isFocusEstimateOnMousePrimaryDevice) {
      this._el.nativeElement.querySelectorAll('input')?.[1]?.focus();
    }
  }

  submit(): void {
    this._taskService.update(this.taskCopy.id, {
      timeEstimate: this.taskCopy.timeEstimate,
      timeSpentOnDay: this.timeSpentOnDayCopy,
    });
    this._matDialogRef.close({
      timeEstimate: this.taskCopy.timeEstimate,
      timeSpentOnDay: this.timeSpentOnDayCopy,
    });
  }

  showAddForAnotherDayForm(): void {
    this._matDialog
      .open(DialogAddTimeEstimateForOtherDayComponent)
      .afterClosed()
      .subscribe((result) => {
        if (result && result.timeSpent > 0 && result.date) {
          this.timeSpentOnDayCopy = {
            ...this.timeSpentOnDayCopy,
            [getWorklogStr(result.date)]: result.timeSpent,
          };
          this.taskCopy.timeSpentOnDay = this.timeSpentOnDayCopy;
          this._cd.detectChanges();
        }
      });
  }

  deleteValue(strDate: string): void {
    delete this.timeSpentOnDayCopy[strDate];
  }

  trackByIndex(i: number, p: any): number {
    return i;
  }
}
