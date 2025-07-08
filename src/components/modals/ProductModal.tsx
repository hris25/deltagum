'use client'

import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@/components/ui'
import { useProduct } from '@/stores'

export interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose }) => {
  const { selectedProduct } = useProduct()

  if (!selectedProduct) {
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedProduct.name}
      size="lg"
    >
      <ModalBody>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🍭</div>
          <p className="text-gray-600">
            Modal de détail du produit - À développer dans les prochaines tâches
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export { ProductModal }
