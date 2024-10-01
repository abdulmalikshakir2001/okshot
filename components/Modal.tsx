import { Fragment, ReactNode, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { CiYoutube, CiImport } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";
import { useTranslation } from 'next-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onFileUpload?: (file: File) => void; // new callback for file upload
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, confirmText, cancelText, onConfirm, onFileUpload }) => {
  const [isUpload, setIsUpload] = useState(true); // state to toggle between upload and import
  const { t } = useTranslation('common');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <CiYoutube className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                      <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        {title}
                      </DialogTitle>
                      <div className="mt-2 flex gap-4">
                        <button
                          className={`flex-1 flex items-center justify-center py-2 px-4 rounded ${isUpload ? 'bg-gray-200' : 'bg-white'}`}
                          onClick={() => setIsUpload(true)}
                        >
                          <FiUpload className="mr-2" />
                          {t('upload')}
                        </button>
                        <button
                          className={`flex-1 flex items-center justify-center py-2 px-4 rounded ${!isUpload ? 'bg-gray-200' : 'bg-white'}`}
                          onClick={() => setIsUpload(false)}
                        >
                          <CiImport className="mr-2" />
                          {t('import-statement')}
                        </button>
                      </div>
                      <div className="mt-4">
                        {isUpload ? (
                          <div className="flex flex-col items-center">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer">
                              <span className="text-gray-500">{<FiUpload />}</span>
                              <input type="file" className="hidden" onChange={handleFileChange} />
                            </label>
                          </div>
                        ) : (
                          children
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  {confirmText &&
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={onConfirm}
                    >
                      {confirmText}
                    </button>
                  }
                  {cancelText &&
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={onClose}
                    >
                      {cancelText}
                    </button>
                  }
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
