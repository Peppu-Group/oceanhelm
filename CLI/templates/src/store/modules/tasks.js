import supabase from '../../supabase';
import axios from 'axios';
import { logActivity } from '@/helpers/activityLogger';

function errorMessage(error) {
  Swal.fire({
    icon: 'error',
    title: 'An Error occurred',
    text: `Error: ${error.message}`,
    confirmButtonText: 'Close',
    customClass: {
      confirmButton: 'swal2-confirm'
    }
  });
};
export default {
  namespaced: true,
  state: {
    tasksByVessel: {}
  },
  mutations: {
    SET_TASKS(state, { vesselId, tasks }) {
      state.tasksByVessel[vesselId] = tasks;
      localStorage.setItem(`tasks-${vesselId}`, JSON.stringify(tasks));
    },
    ADD_TASK(state, { vesselId, task, rootState }) {
      if (!state.tasksByVessel[vesselId]) {
        state.tasksByVessel[vesselId] = [];
      }
      state.tasksByVessel[vesselId].push(task);
      localStorage.setItem(`tasks-${vesselId}`, JSON.stringify(state.tasksByVessel[vesselId]));

      try {
        const nameOnly = task.assignedTo.split('-')[0].trim();
        const crewInfo = rootState.crew.crewMembers.find(m => m.name === nameOnly);
        const companyInfo = rootState.company.company;
        let notificationData = {
          companyName: companyInfo.name,
          name: task.assignedTo,
          notification_type: "task",
          id: task.component,
          due_date: task.nextDue,
          assigned_by: `${companyInfo.name}'s HR`,
          description: task.description,
          email: crewInfo.email,
          operations_email: companyInfo.email,
          operations_phone: companyInfo.phoneNumber
        };


        axios.post('https://proctoredserver.peppubuild.com/notification', notificationData)
          .then(response => {
            console.log('Success:', response.data);
          })
          .catch(error => {
            console.error('Error sending notification:', error.response?.data || error.message);
          });

      } catch (error) {
        console.error('Try block failed:', error);
      }
    },
    DELETE_TASK(state, { vesselId, taskId }) {
      state.tasksByVessel[vesselId] = state.tasksByVessel[vesselId].filter(t => t.id !== taskId);
      localStorage.setItem(`tasks-${vesselId}`, JSON.stringify(state.tasksByVessel[vesselId]));
    }
  },
  actions: {
    async loadTasks({ commit }, vesselId) {
      // const tasks = JSON.parse(localStorage.getItem(`tasks-${vesselId}`) || '[]');
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('vessel', vesselId);

      if (error) {
        console.error('Error fetching crew:', error.message);
        return [];
      }

      // Extract only name and registration_number
      const simplifiedTasks = data.map(task => ({
        taskName: task.task_name,
        description: task.description,
        maintenanceType: task.maintenance_type,
        component: task.component,
        estimatedHours: task.estimated_hours,
        assignedTo: task.assigned_to,
        recurrence: task.recurrence,
        lastPerformed: task.last_performed,
        nextDue: task.next_due,
        reminderDays: task.reminder_days,
        estimatedDuration: task.estimated_duration,
        notes: task.notes,
        status: task.status,
        remainingDays: task.remaining_days,
        attachments: task.attachments,
        checklistProgress: task.checklist_progress,
        after: task.after
      }));

      commit('SET_TASKS', { vesselId, tasks: simplifiedTasks });
    },
    async addTask({ commit, rootState }, { vesselId, task }) {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const user = session.user;
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          const companyId = profile.company_id;
          const { data, error } = await supabase
            .from('tasks')
            .insert([
              {
                task_name: task.taskName,
                email: task.email,
                description: task.description,
                maintenance_type: task.maintenanceType,
                component: task.component,
                estimated_hours: task.estimatedHours,
                assigned_to: task.assignedTo,
                recurrence: task.recurrence,
                last_performed: task.lastPerformed,
                next_due: task.nextDue,
                reminder_days: task.reminderDays,
                estimated_duration: task.estimatedDuration,
                notes: task.notes,
                status: task.status,
                remaining_days: task.reminderDays,
                attachments: task.attachments.file,
                checklist_progress: task.checklistProgress,
                vessel: vesselId,
                company_id: companyId
              }
            ], { returning: 'minimal' }
            );

          if (error) {
            // tell user about error.
            errorMessage(error)
          } else {
            await logActivity({
              id: profile.company_id,
              action: 'add',
              table: 'maintenance',
              details: {
                status: `Added a new task for maintenance`, information: {
                  task_name: task.taskName,
                  description: task.description, vessel: vesselId
                }
              }
            });
            commit('ADD_TASK', { vesselId, task, rootState });
          }
        }
      } else {
        // router push to login
      }
    },
    deleteTask({ commit }, { vesselId, taskId }) {
      commit('DELETE_TASK', { vesselId, taskId });
    },
    async updateTask({ commit }, { vesselId, tasks, updateTask }) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const user = session.user;
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          // Build payload safely
          const updatePayload = {
            checklist_progress: updateTask.checklistProgress,
            status: updateTask.status,
            after: updateTask.after
          };

          // Update in Supabase. we need a method to compare vesselId and component.
          const { data, error } = await supabase
            .from('tasks')
            .update(updatePayload)
            .eq('vessel', vesselId)
            .eq('component', updateTask.component);

          if (error) {
            errorMessage(error)
            return;
          } else {
            await logActivity({
              id: profile.company_id,
              action: 'update',
              table: 'maintenance',
              details: {
                status: `Ticked tasks for maintenance`, information: {
                  vessel: vesselId,
                  component: updateTask.component,
                  status: updateTask.status
                }
              }
            });
            commit('SET_TASKS', { vesselId, tasks });
          }
        }
      }
    },
  },
  getters: {
    getTasksByVessel: state => vesselId => state.tasksByVessel[vesselId] || []
  }
};
