import React from 'react';
import ContentItem from './contentitem';

const LayoutItem = (props) => {
    const { content, style, as, className, customType } = props; 

    if (!content) return <div>Loading</div>;

    const itemprops = {
        ...content,
        id: content.contentid,
        style: style,
        className: className,
    }
    if (as) {
        itemprops.as = as;
    }

    if (!content.contentid) {
        return customType(content);
    }

    return (
        <ContentItem {...itemprops} />
    );
}

export default LayoutItem;