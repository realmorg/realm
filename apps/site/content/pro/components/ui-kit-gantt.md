---
title: Gantt chart
seoTitle: JavaScript gantt chart web component · REALM Pro
description: Project plans with a task tree, dependency arrows, drag to move and resize, critical path, baselines, four zoom levels, 5,000-task scrolling and export.
group: Data
nav: Gantt chart
---

# Gantt chart

Project plans with a task tree, dependency arrows, drag to move and resize, critical path, baselines, four zoom levels, 5,000-task scrolling and export.

<div class="pro-shots">
  <figure>
    <img src="/pro/components/ui-kit-gantt/light-desktop.png" alt="Gantt chart, desktop, light mode" width="960" height="708" loading="lazy">
    <figcaption>Desktop, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-gantt/dark-desktop.png" alt="Gantt chart, desktop, dark mode" width="960" height="708" loading="lazy">
    <figcaption>Desktop, dark mode</figcaption>
  </figure>
</div>

## What it does

The Gantt chart shows a project plan as a task list on the left and a timeline on the right. Each task is a bar that starts on its start date and runs for its duration in days. Tasks can sit under summary tasks, which take their dates from the tasks inside them: a summary starts when its first task starts, ends when its last task ends, and its progress is the average of its tasks weighted by length. Milestones are tasks with no length and show as diamonds.

The chart stays smooth with 5,000 tasks. It only builds the rows and bars you can see, plus a few around them, and draws weekend shading, scale labels and dependency arrows for the visible stretch of time only, so scrolling through a long programme costs a few milliseconds a frame.

## Dependencies and scheduling

Arrows connect tasks that depend on each other. All four standard link types are supported: finish to start, start to start, finish to finish and start to finish, each with an optional lag in days. To add a link, hover a bar and drag from the small circle at its start or end onto another bar; dropping on the left half of the target links to its start, on the right half to its end. Click an arrow and press Delete to remove it. Links that would create a loop, or that connect a task to its own summary, are refused with a spoken message.

When you move a task, the tasks that depend on it move later if they would otherwise break the link, and their own successors follow. Turn this off with `manual-scheduling` if your plan is maintained by hand.

## Editing with the mouse and the keyboard

Drag a bar to move it by whole days, drag either end to change its dates, and drag the small triangle under a bar to set its progress. Dragging a summary moves everything inside it. While you drag, a tooltip shows the new dates, and Escape puts the task back.

The task list is an ARIA tree grid. The arrow keys move between tasks, Right and Left open and close summaries, Enter or F2 renames a task, Alt with the arrow keys moves a task a day at a time, Shift and Alt change its length, and Alt with Up or Down changes its progress by ten percent. Press L on one task and Enter on another to link them. Insert adds a task below the current one and Delete removes it. Every change is announced to screen readers.

## Views and analysis

Switch between day, week, month and quarter scales from the toolbar or with the plus and minus keys. A dashed line marks today and weekends are shaded in the day and week views. The critical path button highlights the chain of tasks that decides the finish date, in a warning colour, along with the arrows that drive it. Baselines show the originally planned dates as a thin bar under each task and turn red when the task now finishes later than planned.

## Events and export

Before a change is kept, the chart sends a `taskchange` event with the new and previous values and the list of tasks that moved with it. Call `preventDefault()` to refuse it and the plan goes back as it was. `dependencyadd`, `dependencyremove`, `taskremove` and `taskadd` work the same way. The Export menu saves the plan as a PNG or SVG image, with colours from your theme, or as a CSV file with outline numbers, dates, durations, progress, predecessors in the familiar `1.2FS+2` form, baselines and whether each task is critical.

```html
<ui-kit-gantt label="Website relaunch" zoom="week" baselines></ui-kit-gantt>
```

Set `tasks` and `dependencies` to arrays from your own data. Colours, spacing and type come from your REALM UI theme, including dark mode.

<div class="pro-shots phone">
  <figure>
    <img src="/pro/components/ui-kit-gantt/light-phone.png" alt="Gantt chart, phone, light mode" width="390" height="837" loading="lazy">
    <figcaption>Phone, light mode</figcaption>
  </figure>
  <figure>
    <img src="/pro/components/ui-kit-gantt/dark-phone.png" alt="Gantt chart, phone, dark mode" width="390" height="837" loading="lazy">
    <figcaption>Phone, dark mode</figcaption>
  </figure>
</div>


## Built from REALM UI

Gantt chart is made from free REALM UI components, so it follows your theme and dark mode like the rest of your page:

- [`ui-button`](/components/button/)
- [`ui-dropdown-menu`](/components/dropdown-menu/)
- [`ui-toggle`](/components/toggle/)
- [`ui-toggle-group`](/components/toggle-group/)

## Use it

Gantt chart is part of [REALM Pro](/pro/). Add it from REALM Pro Studio, or copy the file into your project and load it:

```html
<import-element from="/pro/components/ui-kit-gantt.html"></import-element>
<ui-kit-gantt></ui-kit-gantt>
```
