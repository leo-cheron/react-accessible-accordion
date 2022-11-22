import * as React from 'react';
import { DivAttributes } from '../helpers/types';
import { assertValidHtmlId } from '../helpers/id';
import { Consumer as ItemConsumer, ItemContext } from './ItemContext';

type Props = DivAttributes & {region?: boolean; className?: string; wrapperClassName?: string, animated?: boolean};
type PanelProps = DivAttributes & {region?: boolean; className?: string; wrapperClassName?: string, animated?: boolean; hidden?: boolean};

const Panel = ({
    className,
    wrapperClassName,
    hidden = false,
    animated,
    ...rest
}: PanelProps): JSX.Element => {
    const firstRender = React.useRef(true);
    const ref = React.useRef<HTMLDivElement>(null);
    const refContent = React.useRef<HTMLDivElement>(null);

    if (animated) {
        React.useEffect(() => {
            if (!firstRender.current && ref.current && refContent.current) {
                const height = refContent.current.offsetHeight;
                if (!hidden) {
                    ref.current.style.height = `${height}px`;
                } else if (hidden) {
                    ref.current.style.height = `${height}px`;
                    requestAnimationFrame(() => {
                        if(ref.current) ref.current.style.height = '0';
                    })
                }
            } else if(firstRender.current && !hidden) {
				if(ref.current) ref.current.style.height = 'auto';
			}
            firstRender.current = false;
        }, [hidden])
    }

    const handleTransitionEnd = (event: TransitionEvent) => {
        if (event.currentTarget && event.propertyName === 'height') {
            (event.currentTarget as HTMLDivElement).style.height = hidden ? '0' : 'auto';
        }
    }

    const renderChildren = (hidden: boolean) => (
        <div
            ref={refContent}
            data-accordion-component="AccordionItemPanel"
            className={className}
            hidden={hidden}
            {...rest} />
    )

    return (
        <>
            {animated ? (
                <div ref={ref} hidden={hidden} className={wrapperClassName} onTransitionEnd={handleTransitionEnd}>
                    {renderChildren(false)}
                </div>
            ) : (
                renderChildren(hidden)
            )}
        </>
    )
}
const AccordionItemPanel = ({
    className = 'accordion__panel',
    wrapperClassName = 'accordion__panel-wrapper',
    region,
    animated,
    id,
    ...rest
}: Props): JSX.Element => {

	const renderChildren = ({panelAttributes}: ItemContext): JSX.Element => {
        if (id) {
            assertValidHtmlId(id);
        }
        const attrs = {
            ...panelAttributes,
            'aria-labelledby': region
                ? panelAttributes['aria-labelledby']
                : undefined,
        };

        return (
            <Panel
                data-accordion-component="AccordionItemPanel"
                className={className}
                wrapperClassName={wrapperClassName}
                animated={animated}
                {...rest}
                {...attrs}
                role={region ? 'region' : undefined}
            />
        );
    };

    return <ItemConsumer>{renderChildren}</ItemConsumer>;
};

export default AccordionItemPanel;
