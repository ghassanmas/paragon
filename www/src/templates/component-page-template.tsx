import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { graphql, Link } from 'gatsby';
// @ts-ignore
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
// @ts-ignore
import { Container, Alert, breakpoints, useMediaQuery } from '~paragon-react'; // eslint-disable-line
import CodeBlock from '../components/CodeBlock';
import GenericPropsTable from '../components/PropsTable';
import Layout from '../components/PageLayout';
import SEO from '../components/SEO';
import LinkedHeading from '../components/LinkedHeading';

export interface IPageTemplate {
  data: {
    mdx: {
      frontmatter: {
        title: string,
        status: string,
        components: string,
        notes: string,
      },
      tableOfContents: {
        items: Array<{}>,
      },
      body: string,
    },
    components: {
      nodes: [],
    }
  },
  pageContext: {
    cssVariables: string,
  }
}

export type ShortCodesTypes = {
  displayName: string,
};

export default function PageTemplate({
  data: { mdx, components: componentNodes },
  pageContext: { cssVariables },
}: IPageTemplate) {
  const isMobile = useMediaQuery({ maxWidth: breakpoints.large.maxWidth });
  const [showMinimizedTitle, setShowMinimizedTitle] = useState(false);

  const components = componentNodes.nodes
    .reduce((acc: { [x: string]: { displayName: string }; }, currentValue: { displayName: string; }) => {
      acc[currentValue.displayName] = currentValue;
      return acc;
    }, {});

  const shortcodes = React.useMemo(() => {
    const PropsTable = ({ displayName, ...props }: ShortCodesTypes) => { // eslint-disable-line react/prop-types
      if (components[displayName]) {
        return <GenericPropsTable {...components[displayName]} {...props} />;
      }
      return null;
    };
    // Provide common components here
    return {
      h2: (props: HTMLElement) => <LinkedHeading h="2" {...props} />,
      h3: (props: HTMLElement) => <LinkedHeading h="3" {...props} />,
      h4: (props: HTMLElement) => <LinkedHeading h="4" {...props} />,
      h5: (props: HTMLElement) => <LinkedHeading h="5" {...props} />,
      h6: (props: HTMLElement) => <LinkedHeading h="6" {...props} />,
      pre: (props:
      JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> &
      React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
      code: CodeBlock,
      Link,
      PropsTable,
    };
  }, [components]);

  const cssVariablesTitle = 'Theme Variables (SCSS)';
  const cssVariablesUrl = 'theme-variables-scss';

  const getTocData = () => {
    const tableOfContents = JSON.parse(JSON.stringify(mdx.tableOfContents));
    if (cssVariables && !tableOfContents.items?.includes()) {
      tableOfContents.items?.push({
        title: cssVariablesTitle,
        url: `#${cssVariablesUrl}`,
      });
    }
    return tableOfContents;
  };

  const sortedComponentNames = mdx.frontmatter?.components || [];

  const isDeprecated = mdx.frontmatter?.status?.toLowerCase().includes('deprecate') || false;

  useEffect(() => setShowMinimizedTitle(!!isMobile), [isMobile]);

  return (
    <Layout
      showMinimizedTitle={showMinimizedTitle}
      isMdx
      tocData={getTocData()}
    >
      {/* eslint-disable-next-line react/jsx-pascal-case */}
      <SEO title={mdx.frontmatter.title} />
      <Container size="md" className="py-5">
        {isDeprecated && (
          <Alert variant="warning">
            <Alert.Heading>This component will be removed soon.</Alert.Heading>
            <p className="small mb-0">{mdx.frontmatter.notes}</p>
          </Alert>
        )}
        <h1 className="mb-4">{mdx.frontmatter.title}</h1>
        <MDXProvider components={shortcodes}>
          <MDXRenderer>{mdx.body}</MDXRenderer>
        </MDXProvider>
        {cssVariables && (
          <div className="mb-5">
            <h2 className="mb-4 pgn-doc__heading" id={cssVariablesUrl}>
              {cssVariablesTitle}
              <a href={`#${cssVariablesUrl}`} aria-label="Jump to SCSS variables">
                <span className="pgn-doc__anchor">#</span>
              </a>
            </h2>
            <CodeBlock className="language-scss">{cssVariables}</CodeBlock>
          </div>
        )}
        {typeof sortedComponentNames !== 'string'
            && sortedComponentNames?.map((componentName: string | number) => {
              const node: { displayName: string } = components[componentName];
              if (!node) {
                return null;
              }
              return <GenericPropsTable key={node.displayName} {...node} />;
            })}
      </Container>
    </Layout>
  );
}

PageTemplate.propTypes = {
  data: PropTypes.shape({
    mdx: PropTypes.shape({
      frontmatter: PropTypes.shape({
        title: PropTypes.string,
        status: PropTypes.string,
      }),
      body: PropTypes.any, // eslint-disable-line react/forbid-prop-types
      tableOfContents: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line react/forbid-prop-types
      }),
    }),
    components: PropTypes.shape({
      nodes: PropTypes.arrayOf(PropTypes.shape({})),
    }),
  }).isRequired,
  pageContext: PropTypes.shape({
    cssVariables: PropTypes.string,
  }),
};

PageTemplate.defaultProps = {
  pageContext: null,
};

export const pageQuery = graphql`
  query ComponentPageQuery($id: String, $components: [String]) {
    mdx(id: { eq: $id }) {
      id
      body
      frontmatter {
        title
        status
        notes
        components
      }
      tableOfContents
    }
    components: allComponentMetadata(
      filter: { displayName: { in: $components } }
    ) {
      nodes {
        ...ComponentDocGenData
      }
    }
  }

  fragment ComponentDocGenData on ComponentMetadata {
    displayName
    props {
      defaultValue {
        value
      }
      name
      type {
        name
        raw
        value
      }
      required
      docblock
      doclets
      description {
        id
        text
        childMdx {
          body
        }
      }
    }
  }
`;
