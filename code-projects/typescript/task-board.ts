export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  dueDate?: string;
  status: TaskStatus;
  createdAt: Date;
}

export class TaskBoard {
  private tasks: Task[] = [];
  private nextId = 1;

  add(title: string, dueDate?: string): Task {
    const cleanTitle = title.trim();
    if (!cleanTitle) throw new Error("A task title is required.");
    if (dueDate && Number.isNaN(Date.parse(dueDate))) {
      throw new Error("Enter a valid due date.");
    }

    const task: Task = {
      id: this.nextId++,
      title: cleanTitle,
      dueDate,
      status: "todo",
      createdAt: new Date(),
    };
    this.tasks.push(task);
    return task;
  }

  updateStatus(id: number, status: TaskStatus): Task {
    const task = this.tasks.find((item) => item.id === id);
    if (!task) throw new Error("Task not found.");
    task.status = status;
    return task;
  }

  remove(id: number): boolean {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter((task) => task.id !== id);
    return this.tasks.length !== before;
  }

  list(status?: TaskStatus): readonly Task[] {
    return this.tasks
      .filter((task) => !status || task.status === status)
      .slice()
      .sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"));
  }

  overdue(today = new Date()): Task[] {
    const cutoff = new Date(today);
    cutoff.setHours(0, 0, 0, 0);
    return this.tasks.filter((task) => {
      if (!task.dueDate || task.status === "done") return false;
      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);
      return due < cutoff;
    });
  }
}

// Example:
// const board = new TaskBoard();
// const task = board.add("Prepare project outline", "2026-12-01");
// board.updateStatus(task.id, "in-progress");
// console.log(board.list());
