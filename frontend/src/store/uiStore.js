import { create } from 'zustand';
export const useUIStore = create((set, get) => ({
  darkMode: localStorage.getItem('darkMode') === 'true',
  sidebarOpen: false,
  searchModalOpen: false,
  toggleDarkMode: () => {
    const newDarkMode = !get().darkMode;
    localStorage.setItem('darkMode', newDarkMode.toString());
    set({ darkMode: newDarkMode });
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

  // Manage search modal state for enhanced search experience
  toggleSearchModal: () => set(state => ({ searchModalOpen: !state.searchModalOpen })),

  // Close all modals and overlays
  closeAllModals: () => set({ 
    sidebarOpen: false, 
    searchModalOpen: false 
  })
}));