package com.daymind.dto;

import java.util.List;

public class BatchScheduleRequestDto {
    private List<TaskRequestDto> tasks;

    public List<TaskRequestDto> getTasks() { return tasks; }
    public void setTasks(List<TaskRequestDto> tasks) { this.tasks = tasks; }
}
