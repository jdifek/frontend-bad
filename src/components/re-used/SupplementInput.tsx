import { useState } from 'react';
import { motion } from 'framer-motion';
import { IoAdd, IoCamera, IoClose, IoArrowBack } from 'react-icons/io5';

type Supplement = {
  name: string;
  dose?: string;
  file?: File;
};

type SupplementInputProps = {
  supplements: Supplement[]; // Новое пропс для списка добавок
  onAdd: (supplement: Supplement, callback?: (recognizedSupplements: Supplement[]) => void) => void; // Обновлённый тип
  onRemove: (supplementName: string) => void;
  onPhotosChange?: (photos: File[]) => void;
};

export const SupplementInput = ({ supplements, onAdd, onRemove, onPhotosChange }: SupplementInputProps) => {
  const [inputMethod, setInputMethod] = useState<'manual' | 'photo' | null>(null);
  const [name, setName] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

  const commonSupplements = [
    'Омега-3',
    'Витамин D',
    'Магний',
    'Цинк',
    'Пробиотики',
    'Витамин С',
  ];

  const handleAddSupplement = () => {
    if (name.trim()) {
      onAdd({ name: name.trim() });
      setName('');
    }
  };

  const handleQuickAdd = (supplement: string) => {
    if (supplements.some((s) => s.name === supplement)) {
      onRemove(supplement);
    } else {
      onAdd({ name: supplement });
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos([...photos, ...newPhotos]);
      onPhotosChange?.([...photos, ...newPhotos]);

      for (const file of newPhotos) {
        try {
          await new Promise<void>((resolve) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onAdd({ name: '', file }, () => {
              resolve();
            });
          });
        } catch (error) {
          console.error('Error processing photo:', error);
        }
      }
    }
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    const removedSupplement = supplements[index];
    setPhotos(updatedPhotos);
    if (removedSupplement) {
      onRemove(removedSupplement.name);
    }
    onPhotosChange?.(updatedPhotos);
  };

  return (
    <div className='mb-6'>
      <h2 className='text-lg font-semibold text-blue-900 mb-3'>
        Если вы уже что-то принимаете:
      </h2>

      {!inputMethod && (
        <div className='grid grid-cols-2 gap-3 mb-4'>
          <motion.button
            onClick={() => setInputMethod('photo')}
            className='p-3 text-sm rounded-xl border bg-white text-blue-900 border-gray-300 hover:border-blue-600 transition-all shadow-sm flex items-center justify-center'
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <IoCamera size={20} className='mr-2' />
            Загрузить фото
          </motion.button>
          <motion.button
            onClick={() => setInputMethod('manual')}
            className='p-3 text-sm rounded-xl border bg-white text-blue-900 border-gray-300 hover:border-blue-600 transition-all shadow-sm flex items-center justify-center'
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            ✍️ Ввести вручную
          </motion.button>
        </div>
      )}

      {inputMethod === 'manual' && (
        <>
          <div className='flex items-center mb-4'>
            <motion.button
              onClick={() => setInputMethod(null)}
              className='text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors mr-2'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IoArrowBack size={24} />
            </motion.button>
            <h3 className='text-lg font-semibold text-blue-900'>Ввод вручную</h3>
          </div>

          <div className='flex mb-4'>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='flex-grow p-3 rounded-l-xl border border-gray-300 focus:border-blue-600 focus:outline-none bg-white'
              placeholder='Название добавки'
            />
            <motion.button
              onClick={handleAddSupplement}
              className='bg-blue-600 text-white p-3 rounded-r-xl flex items-center justify-center'
              disabled={!name.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IoAdd size={20} />
            </motion.button>
          </div>

          {supplements.length > 0 && (
            <div className='mb-4'>
              <h3 className='text-sm font-medium text-blue-900 mb-2'>Добавленные добавки:</h3>
              <div className='grid grid-cols-3 gap-2'>
                {supplements.map((supplement, index) => (
                  <div
                    key={index}
                    className='p-2 text-xs rounded-lg border bg-blue-50 text-blue-900 border-blue-600 flex items-center justify-between'
                  >
                    <span>{supplement.name}</span>
                    <motion.button
                      onClick={() => onRemove(supplement.name)}
                      className='text-blue-600'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IoClose size={16} />
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='grid grid-cols-3 gap-2'>
            {commonSupplements.map((supplement) => (
              <motion.button
                key={supplement}
                onClick={() => handleQuickAdd(supplement)}
                className={`p-2 text-xs rounded-lg border ${
                  supplements.some((s) => s.name === supplement)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-blue-900 border-gray-300 hover:border-blue-600'
                } transition-all text-center shadow-sm`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {supplement}
              </motion.button>
            ))}
          </div>
        </>
      )}

      {inputMethod === 'photo' && (
        <>
          <div className='flex items-center mb-4'>
            <motion.button
              onClick={() => setInputMethod(null)}
              className='text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors mr-2'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IoArrowBack size={24} />
            </motion.button>
            <h3 className='text-lg font-semibold text-blue-900'>Загрузка фото</h3>
          </div>

          <label className='block mb-4'>
            <input
              type='file'
              accept='image/*'
              multiple
              onChange={handlePhotoUpload}
              className='hidden'
            />
            <motion.div
              className='p-4 bg-blue-50 rounded-xl border border-dashed border-blue-600 text-center cursor-pointer'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IoCamera size={24} className='mx-auto mb-2 text-blue-600' />
              <p className='text-blue-900 text-sm'>Нажмите, чтобы загрузить фото баночек</p>
            </motion.div>
          </label>
          {photos.length > 0 && (
            <div className='mb-4'>
              <h3 className='text-sm font-medium text-blue-900 mb-2'>Загруженные фото:</h3>
              <div className='grid grid-cols-3 gap-2'>
                {photos.map((photo, index) => (
                  <div key={index} className='relative'>
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Добавка ${index + 1}`}
                      className='w-full h-20 object-cover rounded-lg'
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className='absolute top-1 right-1 bg-blue-600 text-white rounded-full p-1'
                    >
                      <IoClose size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};