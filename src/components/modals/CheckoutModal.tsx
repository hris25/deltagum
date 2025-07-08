'use client'

import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@/components/ui'

export interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Finaliser la commande"
      size="xl"
    >
      <ModalBody>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">💳</div>
          <p className="text-gray-600">
            Modal de checkout avec Stripe - À développer dans les prochaines tâches
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Retour au panier
        </Button>
        <Button variant="primary">
          Payer maintenant
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export { CheckoutModal }
