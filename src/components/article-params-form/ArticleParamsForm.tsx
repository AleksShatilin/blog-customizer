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

/**
 * Форма настройки параметров оформления статьи
 */
export const ArticleParamsForm: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [localSettings, setLocalSettings] = useState<ArticleStateType>(defaultArticleState);
  const formContainerRef = useRef<HTMLElement | null>(null);

  // Эффект для кликов вне формы
  useEffect(() => {
    if (!isOpen) return;

    const handleExternalClick = (event: MouseEvent): void => {
      if (!formContainerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleExternalClick);
    
    return () => {
      document.removeEventListener('mousedown', handleExternalClick);
    };
  }, [isOpen]);

  /**
   * Применяет стили к элементу main
   */
  const applyStylesToMainElement = (settings: ArticleStateType): void => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      Object.entries({
        '--font-family': settings.fontFamilyOption.value,
        '--font-size': settings.fontSizeOption.value,
        '--font-color': settings.fontColor.value,
        '--container-width': settings.contentWidth.value,
        '--bg-color': settings.backgroundColor.value,
      }).forEach(([key, value]) => {
        mainElement.style.setProperty(key, value);
      });
    }
  };

  const handleFormSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    applyStylesToMainElement(localSettings);
    setIsOpen(false);
  };

  const handleSettingsReset = (): void => {
    setLocalSettings({ ...defaultArticleState });
    applyStylesToMainElement(defaultArticleState);
  };

  const updateFormField = (fieldName: keyof ArticleStateType, newValue: OptionType): void => {
    setLocalSettings(prev => ({
      ...prev,
      [fieldName]: newValue
    }));
  };

  const handleToggle = (): void => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <ArrowButton 
        isOpen={isOpen} 
        onClick={handleToggle} 
      />
      
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
          
          <Select
            selected={localSettings.fontFamilyOption}
            onChange={(value: OptionType) => 
              updateFormField('fontFamilyOption', value)
            }
            options={fontFamilyOptions}
            placeholder="Шрифт для текста"
            title="Стиль шрифта"
          />
          
          <RadioGroup
            selected={localSettings.fontSizeOption}
            name="textSize"
            onChange={(value: OptionType) => 
              updateFormField('fontSizeOption', value)
            }
            options={fontSizeOptions}
            title="Размер шрифта"
          />
          
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
          
          <Select
            selected={localSettings.backgroundColor}
            onChange={(value: OptionType) => 
              updateFormField('backgroundColor', value)
            }
            options={backgroundColors}
            placeholder="Фоновый цвет"
            title="Цвет фона"
          />
          
          <Select
            selected={localSettings.contentWidth}
            onChange={(value: OptionType) => 
              updateFormField('contentWidth', value)
            }
            options={contentWidthArr}
            placeholder="Ширина содержимого"
            title="Ширина области"
          />
          
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