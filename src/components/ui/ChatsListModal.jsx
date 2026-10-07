import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { MessageCircle, X, ChevronRight, MapPin } from 'lucide-react';
import { haptic } from '../../lib/haptics';

export default function ChatsListModal({ isOpen, onClose }) {
  const { connectedIds, allUsers, chats, openChat } = useStore();

  if (!isOpen) return null;

  // Find all connected partner objects
  const connectedPartners = connectedIds
    .map((id) => allUsers.find((u) => u.id === id))
    .filter(Boolean);

  const handleSelectPartner = (partner) => {
    haptic.light();
    openChat(partner);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-[#14050A] border-t sm:border border-[#3D151C] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] select-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#2A0D14]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-gold-gradient">
                  My Garba Jodis
                </h3>
                <span className="text-[10px] text-text-muted uppercase font-semibold">
                  {connectedPartners.length} Active Conversations
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-[#1A0A0A] border border-[#3D151C] hover:border-gold/50 flex items-center justify-center text-text-muted hover:text-white transition-colors cursor-pointer touch-manipulation active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List of Connected Partners */}
          <div className="flex-1 overflow-y-auto py-3 space-y-2">
            {connectedPartners.length === 0 ? (
              <div className="text-center py-10 px-4">
                <span className="text-4xl block mb-2">🪔</span>
                <p className="text-sm font-semibold text-[#FFF5E4]">No connected Jodis yet</p>
                <p className="text-xs text-text-muted mt-1">
                  Start swiping and connect with dancers to unlock in-app festive chat!
                </p>
              </div>
            ) : (
              connectedPartners.map((partner) => {
                const partnerMessages = chats[partner.id] || [];
                const lastMsg = partnerMessages[partnerMessages.length - 1];

                return (
                  <button
                    key={partner.id}
                    type="button"
                    onClick={() => handleSelectPartner(partner)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#1A0A0A] hover:bg-[#250E13] border border-[#3D151C] hover:border-gold/30 transition-all text-left cursor-pointer touch-manipulation active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-primary to-gold overflow-hidden">
                          <img
                            src={
                              partner.photo_url ||
                              'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'
                            }
                            alt={partner.naam}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border border-[#1A0A0A]" />
                      </div>

                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <h4 className="font-heading font-bold text-sm text-[#FFF5E4] truncate">
                            {partner.naam}
                          </h4>
                          <span className="text-[10px] text-gold font-medium px-1.5 py-0.2 rounded-full bg-gold/15">
                            {partner.city}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted truncate mt-0.5 max-w-[200px]">
                          {lastMsg ? lastMsg.text : 'Start your Garba chat... 🪔'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {lastMsg && (
                        <span className="text-[10px] text-text-muted mr-1">
                          {lastMsg.timestamp}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-gold/60" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
