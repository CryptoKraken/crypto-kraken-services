import * as tsNode from 'ts-node';
import * as ts from 'typescript';

const NYC_IGNORE_NEXT_COMMENT = 'istanbul ignore next';

tsNode.register({
    ...tsNode.DEFAULTS,
    transformers: {
        after: [ignoreCommonJsModuleInitForNyc]
    },
    cache: false
});

function ignoreCommonJsModuleInitForNyc(context: ts.TransformationContext) {
    return (sourceFile: ts.SourceFile) => {
        const tryAddComment = (node: ts.Node): ts.Node => {
            if (ts.isExpressionStatement(node) && isCommonJsModuleInitStatement(node))
                return ts.addSyntheticLeadingComment(node, ts.SyntaxKind.MultiLineCommentTrivia,
                    NYC_IGNORE_NEXT_COMMENT, true);
            return ts.visitEachChild(node, tryAddComment, context);
        };

        return ts.visitEachChild(sourceFile, tryAddComment, context);
    };
}

function isCommonJsModuleInitStatement(expression: ts.ExpressionStatement) {
    // Object.defineProperty(exports, "__esModule", { value: true });
    if (!ts.isCallExpression(expression.expression))
        return false;

    const callExpression = expression.expression;
    if (/* Object.defineProperty */ !ts.isPropertyAccessExpression(callExpression.expression)
        /* Object */ || !ts.isIdentifier(callExpression.expression.expression)
        || callExpression.expression.expression.text !== 'Object'
        /* defineProperty */ || !ts.isIdentifier(callExpression.expression.name)
        || callExpression.expression.name.text !== 'defineProperty'
    )
        return false;

    if (/* (exports, "__esModule", { value: true }) */ callExpression.arguments.length < 2)
        return false;

    const [argument1, argument2] = callExpression.arguments;
    if (/* exports */ !ts.isIdentifier(argument1) || argument1.text !== 'exports'
        || !ts.isStringLiteral(argument2) || argument2.text !== '__esModule'
    )
        return false;

    return true;
}
