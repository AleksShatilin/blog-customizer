import React, { useState, useEffect, useRef, FC } from 'react';
import clsx from 'clsx';
import styles from './ArticleParamsForm.module.scss';
import { ArrowButton } from '../../ui/arrow-button';
import { Button } from '../../ui/button';
import { Select } from '../../ui/select';
import { RadioGroup } from '../../ui/radio-group';
import { Separator } from '../../ui/separator';
import { Text } from '../../ui/text';
import { 
  ArticleStateType, 
  OptionType, 
  defaultArticleState,
  fontFamilyOptions,
  fontSizeOptions,
  fontColors,
  backgroundColors,
  contentWidthArr
} from '../../constants/articleProps';

// Интерфейс пропсов компонента формы
interface ArticleParamsFormProps {
  isOpen: boolean;
  onToggle: () => void;
  currentValues: ArticleStateType;
  onApply: (values: ArticleStateType) => void;
}

/**
 * Форма настройки параметров оформления статьи
 * Предоставляет интерфейс для выбора шрифта, размеров, цветов и других стилей
 * Реализует логику открытия/закрытия и применения изменений
 */
export const ArticleParamsForm: FC<ArticleParamsFormProps> = ({
  isOpen,
  onToggle,
  currentValues,
  onApply
}) => {
  // Локальное состояние формы (отдельно от глобального состояния)
  const [localSettings, setLocalSettings] = useState<ArticleStateType>(currentValues);
  
  // Референс для отслеживания кликов вне области формы
  const formContainerRef = useRef<HTMLElement | null>(null);

  // Эффект для обработки кликов вне открытой панели
  useEffect(() => {
    const handleExternalClick = (event: MouseEvent): void => {
      if (isOpen && !formContainerRef.current?.contains(event.target as Node)) {
        onToggle();
      }
    };

    document.addEventListener('mousedown', handleExternalClick);
    
    return () => {
      document.removeEventListener('mousedown', handleExternalClick);
    };
  }, [isOpen, onToggle]);

  /**
   * Обработчик отправки формы (применение настроек)
   */
  const handleFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    onApply(localSettings);
  };

  /**
   * Обработчик сброса настроек к значениям по умолчанию
   */
  const handleSettingsReset = (): void => {
    setLocalSettings({ ...defaultArticleState });
    onApply(defaultArticleState);
  };

  /**
   * Универсальный обработчик изменения полей формы
   */
  const updateFormField = (fieldName: keyof ArticleStateType, newValue: OptionType): void => {
    setLocalSettings(prev => ({
      ...prev,
      [fieldName]: newValue
    }));
  };

  return (
    <>
      {/* Кнопка управления видимостью панели */}
      <ArrowButton 
        isOpen={isOpen} 
        onClick={onToggle} 
      />
      
      {/* Основная панель с формой настроек */}
      <aside
        className={clsx(styles.container, {
          [styles.container_open]: isOpen,
        })}
        ref={formContainerRef}
      >
        <form 
          className={styles.form} 
          onSubmit={handleFormSubmit}
          noValidate
        >
          <Text
            as="h2"
            size={31}
            weight={800}
            uppercase
            align="center"
            family="open-sans"
          >
            Параметры оформления
          </Text>
          
          {/* Поле выбора шрифта */}
          <Select
            selected={localSettings.fontFamilyOption}
            onChange={(value: OptionType) => 
              updateFormField('fontFamilyOption', value)
            }
            options={fontFamilyOptions}
            placeholder="Шрифт для текста"
            title="Стиль шрифта"
          />
          
          {/* Группа выбора размера шрифта */}
          <RadioGroup
            selected={localSettings.fontSizeOption}
            name="textSize"
            onChange={(value: OptionType) => 
              updateFormField('fontSizeOption', value)
            }
            options={fontSizeOptions}
            title="Размер шрифта"
          />
          
          {/* Поле выбора цвета текста */}
          <Select
            selected={localSettings.fontColor}
            onChange={(value: OptionType) => 
              updateFormField('fontColor', value)
            }
            options={fontColors}
            placeholder="Цвет текста"
            title="Цветовая схема текста"
          />
          
          <Separator />
          
          {/* Поле выбора цвета фона */}
          <Select
            selected={localSettings.backgroundColor}
            onChange={(value: OptionType) => 
              updateFormField('backgroundColor', value)
            }
            options={backgroundColors}
            placeholder="Фоновый цвет"
            title="Цвет фона"
          />
          
          {/* Поле выбора ширины контента */}
          <Select
            selected={localSettings.contentWidth}
            onChange={(value: OptionType) => 
              updateFormField('contentWidth', value)
            }
            options={contentWidthArr}
            placeholder="Ширина содержимого"
            title="Ширина области"
          />
          
          {/* Панель с кнопками управления */}
          <div className={styles.bottomContainer}>
            <Button
              title="Вернуть по умолчанию"
              htmlType="reset"
              type="clear"
              onClick={handleSettingsReset}
            />
            <Button
              title="Применить параметры"
              htmlType="submit"
              type="apply"
            />
          </div>
        </form>
      </aside>
    </>
  );
};